const Resume = require('../models/Resume');

// @desc    Save or Update a user's resume
// @route   POST /api/resumes
const saveResume = async (req, res) => {
  try {
    // 1. The bouncer (middleware) attached the user's ID to req.user
    const userId = req.user.id;

    // 2. Check if this user already has a resume saved in the database
    let resume = await Resume.findOne({ user: userId });

    if (resume) {
      // 3. If they DO have one, update it with the new data from React (req.body)
      resume = await Resume.findOneAndUpdate(
        { user: userId },
        { $set: req.body }, // $set tells MongoDB to overwrite the old fields with the new ones
        { new: true }       // Return the newly updated document
      );
      return res.status(200).json(resume);
    }

    // 4. If they DO NOT have one, create a brand new resume document
    resume = new Resume({
      user: userId,
      ...req.body // The "..." takes all the form arrays (pinfo, education, etc.) and unpacks them here
    });

    await resume.save();
    res.status(201).json(resume);

  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Server error while saving resume' });
  }
};

// @desc    Get the logged-in user's resume
// @route   GET /api/resumes
const getResume = async (req, res) => {
  try {
    // 1. Find the exact resume that matches the ID on the user's wristband
    const resume = await Resume.findOne({ user: req.user.id });

    // 2. If they haven't saved a resume yet, tell React it wasn't found
    if (!resume) {
      return res.status(404).json({ message: 'No resume found for this user' });
    }

    // 3. Send the resume data back to React to fill in the form
    res.status(200).json(resume);

  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Server error while fetching resume' });
  }
};

module.exports = { saveResume, getResume };