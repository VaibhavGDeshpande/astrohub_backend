import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for 3D models (GLB files)
const modelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/models/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File filter for GLB files only
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

// File filter for both images and models
const mixedFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const modelTypes = /glb|gltf/;
  const extname = path.extname(file.originalname).toLowerCase();
  
  const isImage = imageTypes.test(extname);
  const isModel = modelTypes.test(extname);

  if (isImage || isModel) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) or 3D models (glb, gltf) are allowed'));
  }
};

// Multer configuration for images only
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: imageFilter
});

// Multer configuration for GLB models only
export const uploadModel = multer({
  storage: modelStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit (3D models are usually larger)
  },
  fileFilter: modelFilter
});

// Multer configuration for mixed uploads (images + models)
export const uploadMixed = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Determine destination based on file type
      const extname = path.extname(file.originalname).toLowerCase();
      if (/jpeg|jpg|png|gif|webp/.test(extname)) {
        cb(null, 'uploads/images/');
      } else if (/glb|gltf/.test(extname)) {
        cb(null, 'uploads/models/');
      } else {
        cb(null, 'uploads/');
      }
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: mixedFilter
});

// Default export (for backward compatibility)
export default uploadImage;