const express= require('express')
const router= express.Router()
const {analyseResume} = require('../controllers/analyseController')
const { protect } = require('../middlewares/authMiddleware');

router.post('/',protect,analyseResume)

module.exports =router