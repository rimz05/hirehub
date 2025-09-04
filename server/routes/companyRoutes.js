import express from 'express'
import { ChangeJobApplicationStatus, ChangeVisbilility, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/CompanyControllers.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middlewars/authMiddleware.js'


const router = express.Router()

// register compnay
router.post('/register',upload.single('image'), registerCompany)

// company login
router.post('/login',loginCompany )

// get company data
router.get('/company', protectCompany, getCompanyData)

// post a job
router.post('/post-job',protectCompany, postJob)

// get application data of company 
router.get('/applicant', protectCompany, getCompanyJobApplicants)

// get compnay job list 
router.get('/list-jobs', protectCompany, getCompanyPostedJobs)

// change application status
router.post('/change-status',protectCompany, ChangeJobApplicationStatus)

// change application visibility
router.post('/change-visibility',protectCompany, ChangeVisbilility)

export default router



