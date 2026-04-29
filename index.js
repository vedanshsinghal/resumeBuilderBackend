require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cors = require('cors');

// Add your Vercel URL to the guest list
app.use(cors({
  origin: 'https://resumebuilder-opal-pi.vercel.app/', // Replace with your actual Vercel URL!
  credentials: true
}));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));


// ... existing imports
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes'); // Add this line

// ... existing middleware and DB connection

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes); // Add this line

// Basic Test Route
app.get('/', (req, res) => {
  res.send('Resume Builder API is running!');
});
// ... existing app.listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});