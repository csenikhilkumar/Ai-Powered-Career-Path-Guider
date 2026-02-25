// api-gateway

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : "http://localhost:5173",
};