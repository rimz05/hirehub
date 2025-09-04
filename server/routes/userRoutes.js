import express from 'express'
import { appForJobs, getUserData, getUserJobApplication, updateUserResume } from '../controllers/userController.js'
import upload from '../config/multer.js'
// 

const router = express.Router()

// get user data
router.get('/user', getUserData)

// apply for job
router.post('/apply', appForJobs)

// get applied job data
router.get('/application', getUserJobApplication)

// update user profile resume
router.post('/update-resume', upload.single('resume'), updateUserResume)

export default router;