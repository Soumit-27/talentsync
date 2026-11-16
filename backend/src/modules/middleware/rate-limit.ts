import { RequestHandler } from "express";
// Per-process protection; use a shared ingress limiter for multiple instances.
export function rateLimit(limit: number, windowMs: number): RequestHandler {
  const buckets = new Map<string, { count: number; expires: number }>();
  const cleanup = setInterval(() => {
    for (const [key, value] of buckets)
      if (value.expires <= Date.now()) buckets.delete(key);
  }, windowMs);
  cleanup.unref();
  return (req, res, next) => {
    const key = req.ip ?? "unknown";
    let bucket = buckets.get(key);
    if (!bucket || bucket.expires <= Date.now()) {
      bucket = { count: 0, expires: Date.now() + windowMs };
      buckets.set(key, bucket);
    }
    if (++bucket.count > limit) {
      res.setHeader(
        "Retry-After",
        Math.ceil((bucket.expires - Date.now()) / 1000),
      );
      res
        .status(429)
        .json({
          success: false,
          message: "Too many attempts. Please try again later.",
        });
      return;
    }
    next();
  };
}
