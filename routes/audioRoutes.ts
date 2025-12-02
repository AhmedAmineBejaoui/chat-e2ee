import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadsDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['audio/webm', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format audio non supporte'));
    }
  }
});

const resolveBaseUrl = (req: Request): string => {
  if (process.env.PUBLIC_SERVER_URL) {
    return process.env.PUBLIC_SERVER_URL.replace(/\/$/, '');
  }
  const forwardedProto = req.headers['x-forwarded-proto'];
  const protoHeader = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  const protocol = (protoHeader?.split(',')[0] || req.protocol || 'http').replace(/:\s*$/, '');
  const host = req.get('host');
  return `${protocol}://${host}`;
};

router.post('/upload', upload.single('audio'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Aucun fichier audio fourni' });
  }

  const baseUrl = resolveBaseUrl(req);
  const audioUrl = `${baseUrl}/uploads/audio/${req.file.filename}`;
  return res.json({
    success: true,
    audioUrl,
    audioSize: req.file.size,
    filename: req.file.filename
  });
});

router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Audio upload failed', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: err.message });
  }
  const message = err instanceof Error ? err.message : 'Upload echoue';
  return res.status(400).json({ success: false, error: message });
});

export default router;
