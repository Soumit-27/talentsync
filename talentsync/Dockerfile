FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG API_URL=http://backend:5000
ENV API_URL=$API_URL
ENV NEXT_PUBLIC_API_URL=""
RUN npm run build && chown -R node:node .next
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["npm", "start"]
