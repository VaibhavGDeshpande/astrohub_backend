import express from 'express';
import { 
  getAllPlanets,
  getPlanetById,
  createPlanet,
  updatePlanet,
  deletePlanet
} from '../controller/planetController.js';
import { uploadModel } from '../config/multer.js';

const router = express.Router();

router.route('/')
  .get(getAllPlanets)
  .post(uploadModel.fields([
    { name: 'model', maxCount: 1 }
  ]), createPlanet);

router.route('/:id')
  .get(getPlanetById)
  .put(uploadModel.fields([
    { name: 'model', maxCount: 1 }
  ]), updatePlanet)
  .delete(deletePlanet);

export default router;