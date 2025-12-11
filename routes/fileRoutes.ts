import express, { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Créer les répertoires d'upload
const uploadsDir = path.join(__dirname, '../uploads/files');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Types MIME acceptés par catégorie
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
  // Images
  image: [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 
    'image/svg+xml', 'image/bmp', 'image/tiff'
  ],
  // Vidéos
  video: [
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'video/x-msvideo', 'video/x-matroska', 'video/3gpp'
  ],
  // Audio
  audio: [
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
    'audio/aac', 'audio/flac', 'audio/mp4', 'audio/x-m4a'
  ],
  // Documents
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation'
  ],
  // Archives
  archive: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/gzip',
    'application/x-tar'
  ],
  // Code/Texte
  code: [
    'application/json',
    'application/xml',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript'
  ]
};

// Fusionner tous les types autorisés
const ALL_ALLOWED_MIMES = Object.values(ALLOWED_MIME_TYPES).flat();

// Taille maximale : 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

// Configuration Multer
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALL_ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non supporté: ${file.mimetype}`));
    }
  }
});

// Fonction pour déterminer la catégorie du fichier
const getFileCategory = (mimetype: string): string => {
  for (const [category, mimes] of Object.entries(ALLOWED_MIME_TYPES)) {
    if (mimes.includes(mimetype)) {
      return category;
    }
  }
  return 'other';
};

// Construire l'URL de base
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

// Route d'upload de fichier unique
router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      error: 'Aucun fichier fourni' 
    });
  }

  const baseUrl = resolveBaseUrl(req);
  const fileUrl = `${baseUrl}/uploads/files/${req.file.filename}`;
  const category = getFileCategory(req.file.mimetype);

  return res.json({
    success: true,
    file: {
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      category
    }
  });
});

// Route d'upload de fichiers multiples (max 10)
router.post('/upload-multiple', upload.array('files', 10), (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  
  if (!files || files.length === 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Aucun fichier fourni' 
    });
  }

  const baseUrl = resolveBaseUrl(req);
  const uploadedFiles = files.map(file => ({
    url: `${baseUrl}/uploads/files/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
    category: getFileCategory(file.mimetype)
  }));

  return res.json({
    success: true,
    files: uploadedFiles,
    count: uploadedFiles.length
  });
});

// Route pour obtenir les types de fichiers supportés
router.get('/supported-types', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeFormatted: `${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    categories: ALLOWED_MIME_TYPES
  });
});

// Gestion des erreurs
router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('File upload failed:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        error: `Fichier trop volumineux. Taille max: ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        success: false, 
        error: 'Trop de fichiers. Maximum 10 fichiers à la fois.' 
      });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  
  const message = err instanceof Error ? err.message : 'Upload échoué';
  return res.status(400).json({ success: false, error: message });
});

export default router;
