import express from 'express';
import { 
  getAllPlanets,
  getPlanetById,
  createPlanet,
  updatePlanet,
  deletePlanet
} from '../controller/planetController.js';
import { uploadMixed } from '../config/multer.js';

const router = express.Router();

// Planet routes with support for both image and model uploads
router.route('/')
  .get(getAllPlanets)
  .post(uploadMixed.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model', maxCount: 1 }
  ]), createPlanet);

router.route('/:id')
  .get(getPlanetById)
  .put(uploadMixed.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model', maxCount: 1 }
  ]), updatePlanet)
  .delete(deletePlanet);

export default router;