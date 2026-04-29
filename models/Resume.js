const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  // The digital padlock linking to the User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Matches const [pinfo, setPinfo]
  pinfo: {
    name: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" }
  },

  // Matches const [link, setLink]
  link: [{
    link: { type: String, default: "" },
    url: { type: String, default: "" }
  }],

  // Matches const [education, setEducation]
  education: [{
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    grade: { type: String, default: "" },
    time: { type: String, default: "" }
  }],
  
  // Matches const [experience, setExperience]
  experience: [{
    time: { type: String, default: "" },
    organisation: { type: String, default: "" },
    role: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  
  // Matches const [project, setProject]
  project: [{
    time: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  
  // Matches const [skills, setSkills]
  skills: [{
    skill: { type: String, default: "" }
  }],

  // Matches const [achievement, setAchievement]
  achievement: [{
    achievement: { type: String, default: "" }
  }],

  // Matches const [other, setOther]
  other: [{
    skill: { type: String, default: "" } 
  }],

  // Matches const [por, setPor]
  por: [{
    por: { type: String, default: "" },
    description: { type: String, default: "" }
  }]

}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);