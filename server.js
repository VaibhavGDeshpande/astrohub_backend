import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors'
import { fileURLToPath } from 'url';
import planetRoutes from './src/routes/planetRoutes.js';
import { notFound } from './src/middleware/errorHandler.js';
import connectDB from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      planets: '/api/planets'
    }
  });
});

app.use('/api/planets', planetRoutes);

// Error handling middleware
app.use(notFound);

// Start server ONLY after DB connection
const startServer = async () => {
  try {
    await connectDB();  // Wait for DB connection
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
