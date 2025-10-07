import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for 3D models (GLB/GLTF files)
const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/models/planets');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for GLB/GLTF files only
const modelFilter = (req, file, cb) => {
  const allowedTypes = /glb|gltf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // GLB files have mimetype: model/gltf-binary
  // GLTF files have mimetype: model/gltf+json
  const isModelType = file.mimetype === 'model/gltf-binary' || 
                      file.mimetype === 'model/gltf+json' ||
                      file.mimetype === 'application/octet-stream'; // Sometimes GLB comes as this

  if (isModelType || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only GLB/GLTF 3D model files are allowed'));
  }
};

// Multer configuration for GLB/GLTF models
export const uploadModel = multer({
  storage: modelStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit (3D models are usually larger)
  },
  fileFilter: modelFilter
});

// Default export
export default uploadModel;
