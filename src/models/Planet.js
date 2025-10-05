import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Planet name is required'],
    trim: true,
    unique: true
  },
  image: {
    type: String
  },
  model:{
    type: String
  }
}, {
  timestamps: true
});

const Planet = mongoose.model('Planet', planetSchema);

export default Planet;