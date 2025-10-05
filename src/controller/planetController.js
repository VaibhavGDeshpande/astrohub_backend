import Planet from '../models/Planet.js';
import fs from 'fs';
import path from 'path';

// @desc    Get all planets
// @route   GET /api/planets
// @access  Public
export const getAllPlanets = async (req, res, next) => {
  try {
    const planets = await Planet.find();
    res.status(200).json({
      success: true,
      count: planets.length,
      data: planets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single planet by ID
// @route   GET /api/planets/:id
// @access  Public
export const getPlanetById = async (req, res, next) => {
  try {
    const planet = await Planet.findById(req.params.id);

    if (!planet) {
      const error = new Error('Planet not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: planet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new planet with optional image and 3D model
// @route   POST /api/planets
// @access  Public
export const createPlanet = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if planet already exists
    const planetExists = await Planet.findOne({ name });
    if (planetExists) {
      // Delete uploaded files
      if (req.files) {
        if (req.files.image) fs.unlinkSync(req.files.image[0].path);
        if (req.files.model) fs.unlinkSync(req.files.model[0].path);
      }
      const error = new Error('Planet with this name already exists');
      error.statusCode = 400;
      throw error;
    }

    const planetData = {
      name
    };

    // Add image path if uploaded
    if (req.files && req.files.image) {
      planetData.image = `/uploads/images/${req.files.image[0].filename}`;
    }

    // Add model path if uploaded
    if (req.files && req.files.model) {
      planetData.model = `/uploads/models/${req.files.model[0].filename}`;
    }

    const planet = await Planet.create(planetData);

    res.status(201).json({
      success: true,
      data: planet
    });
  } catch (error) {
    // Delete uploaded files if error occurs
    if (req.files) {
      if (req.files.image) fs.unlinkSync(req.files.image[0].path);
      if (req.files.model) fs.unlinkSync(req.files.model[0].path);
    }
    next(error);
  }
};

// @desc    Update planet
// @route   PUT /api/planets/:id
// @access  Public
export const updatePlanet = async (req, res, next) => {
  try {
    const planet = await Planet.findById(req.params.id);

    if (!planet) {
      // Delete uploaded files if any
      if (req.files) {
        if (req.files.image) fs.unlinkSync(req.files.image[0].path);
        if (req.files.model) fs.unlinkSync(req.files.model[0].path);
      }
      const error = new Error('Planet not found');
      error.statusCode = 404;
      throw error;
    }

    // Update name if provided
    if (req.body.name) {
      planet.name = req.body.name;
    }

    // Update image if new file uploaded
    if (req.files && req.files.image) {
      // Delete old image
      if (planet.image) {
        const oldImagePath = path.join('uploads/images', path.basename(planet.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      planet.image = `/uploads/images/${req.files.image[0].filename}`;
    }

    // Update model if new file uploaded
    if (req.files && req.files.model) {
      // Delete old model
      if (planet.model) {
        const oldModelPath = path.join('uploads/models', path.basename(planet.model));
        if (fs.existsSync(oldModelPath)) {
          fs.unlinkSync(oldModelPath);
        }
      }
      planet.model = `/uploads/models/${req.files.model[0].filename}`;
    }

    await planet.save();

    res.status(200).json({
      success: true,
      data: planet
    });
  } catch (error) {
    if (req.files) {
      if (req.files.image) fs.unlinkSync(req.files.image[0].path);
      if (req.files.model) fs.unlinkSync(req.files.model[0].path);
    }
    next(error);
  }
};

// @desc    Delete planet
// @route   DELETE /api/planets/:id
// @access  Public
export const deletePlanet = async (req, res, next) => {
  try {
    const planet = await Planet.findById(req.params.id);

    if (!planet) {
      const error = new Error('Planet not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete image file
    if (planet.image) {
      const imagePath = path.join('uploads/images', path.basename(planet.image));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete model file
    if (planet.model) {
      const modelPath = path.join('uploads/models', path.basename(planet.model));
      if (fs.existsSync(modelPath)) {
        fs.unlinkSync(modelPath);
      }
    }

    await Planet.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
      message: 'Planet and associated files deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};