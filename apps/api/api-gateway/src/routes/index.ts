// api-gateway
import type { Router as ExpressRouter } from "express";
import { Router } from "express";
import proxy from "express-http-proxy";
import { services } from "../config/services";
import { authenticate } from "../middlewares/auth.middleware";

const router: ExpressRouter = Router();

router.use(
  "/auth",
  proxy(services.auth, {
    proxyReqPathResolver: (req) => {
      return "/auth" + req.url;
    },
  }),
);

router.use(
  "/users",
  authenticate,
  proxy(services.user, {
    proxyReqPathResolver: (req) => {
      return "/users" + req.url;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user?.userId) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
        if (srcReq.user.email) {
          proxyReqOpts.headers["x-user-email"] = srcReq.user.email;
        }
      }
      return proxyReqOpts;
    },
  }),
);

router.use(
  "/careers",
  authenticate,
  proxy(services.career, {
    proxyReqPathResolver: (req) => {
      console.log(`[Gateway] Proxying Career Request: ${req.originalUrl} -> ${req.originalUrl.replace("/api/v1/careers", "")}`);
      return req.originalUrl.replace("/api/v1/careers", "");
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user?.userId) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
  }),
);

router.use(
  "/ai",
  authenticate,
  proxy(services.ai, {
    proxyReqPathResolver: (req) => {
      return "/ai" + req.url;
    },
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user?.userId) {
        proxyReqOpts.headers = proxyReqOpts.headers || {};
        proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
      }
      return proxyReqOpts;
    },
  }),
);

export default router;