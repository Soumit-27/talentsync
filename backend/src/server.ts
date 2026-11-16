import "dotenv/config";
import { app } from "./app";
import prisma from "./lib/prisma";
async function start() {
  for (const name of ["DATABASE_URL", "JWT_SECRET"])
    if (!process.env[name]) throw new Error(name + " is required.");
  if (process.env.NODE_ENV === "production") {
    if ((process.env.JWT_SECRET?.length ?? 0) < 32)
      throw new Error(
        "JWT_SECRET must contain at least 32 characters in production.",
      );
    if (!process.env.FRONTEND_URL?.startsWith("https://"))
      throw new Error(
        "FRONTEND_URL must be the public HTTPS frontend origin in production.",
      );
  }
  await prisma.$connect();
  const server = app.listen(Number(process.env.PORT || 5000), () =>
    console.log("TalentSync API is listening."),
  );
  const shutdown = () => {
    server.close(() => {
      void prisma.$disconnect().finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
start().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Server failed to start.",
  );
  process.exit(1);
});
