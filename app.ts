import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import rateLimit from 'express-rate-limit';

import apiController from './backend/api';

require("dotenv").config();

const app = express();
app.enable("trust proxy");
app.disable("x-powered-by");
const allowedOrigins = (process.env.CLIENT_ORIGIN || "").split(",").map(origin => origin.trim()).filter(Boolean);

const enforceHttps = process.env.ENFORCE_HTTPS === "true";
const hstsMaxAge = Number(process.env.HSTS_MAX_AGE || 31536000);
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 120),
  standardHeaders: true,
  legacyHeaders: false
});

app.use((req, res, next) => {
  res.setHeader("Strict-Transport-Security", `max-age=${hstsMaxAge}; includeSubDomains`);
  if (enforceHttps && !(req.secure || req.headers["x-forwarded-proto"] === "https")) {
    const host = req.headers.host;
    if (host) {
      return res.redirect(308, `https://${host}${req.originalUrl}`);
    }
  }
  next();
});
app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true
}));
const MAX_JSON_PAYLOAD = process.env.MAX_JSON_PAYLOAD || "25mb";
app.use(bodyParser.json({ limit: MAX_JSON_PAYLOAD }));
app.use(bodyParser.urlencoded({ extended: true, limit: MAX_JSON_PAYLOAD }));
app.use((req, res, next) => {
  if (allowedOrigins.length > 0) {
    const requestOrigin = req.headers.origin;
    if (allowedOrigins.includes(requestOrigin)) {
      res.header("Access-Control-Allow-Origin", requestOrigin);
    }
  } else {
    res.header("Access-Control-Allow-Origin", "*");
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// Basic rate limiting to mitigate brute-force/flooding
app.use("/api", limiter);

// add routes
app.use("/api", apiController);

app.get("/", (_req, res) => {
  res.send("✅ Server is running");
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
} else {
  app.get("/*", (req, res) => {
    res.status(500).send("Cant serve production build in dev mode, please open react dev server");
  });
}

export default app;
