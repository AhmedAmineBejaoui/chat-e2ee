require("dotenv").config();
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

import app from './app';
import db from './backend/db';
import { initSocket } from './backend/socket.io';

const PORT = process.env.PORT || 3000;

type Protocol = "http" | "https";

const logStartup = (protocol: Protocol) => {
  // eslint-disable-next-line no-console
  console.log(`Server running at ${PORT}${protocol === "https" ? " (https)" : ""}`);
  db.connectDb();
};



let server: http.Server | https.Server | null = null;

if (process.env.SSL_KEY_FILE && process.env.SSL_CERT_FILE) {
  try {
    const keyPath = path.resolve(process.env.SSL_KEY_FILE);
    const certPath = path.resolve(process.env.SSL_CERT_FILE);
    const key = fs.readFileSync(keyPath);
    const cert = fs.readFileSync(certPath);
    const httpsServer = https.createServer({ key, cert }, app);
    httpsServer.listen(PORT, () => logStartup("https"));
    server = httpsServer;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start HTTPS server, falling back to HTTP.", error);
  }
}

if (!server) {
  server = app.listen(PORT, () => logStartup("http"));
}

initSocket(server);
