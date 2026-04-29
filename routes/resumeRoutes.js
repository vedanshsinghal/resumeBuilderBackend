const express = require('express');
const router = express.Router();
const { saveResume, getResume } = require('../controllers/resumeController');
const { protect } = require('../middlewares/authMiddleware');

// Route to get the resume (Needs wristband)
// GET http://localhost:5000/api/resumes
router.get('/', protect, getResume);

// Route to save/update the resume (Needs wristband)
// POST http://localhost:5000/api/resumes
router.post('/', protect, saveResume);

module.exports = router;