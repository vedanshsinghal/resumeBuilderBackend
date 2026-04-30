require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'https://resumebuilder-opal-pi.vercel.app',
    'http://localhost:5173'                    
  ],
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes'); 

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes); 

app.get('/', (req, res) => {
  res.send('Resume Builder API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});