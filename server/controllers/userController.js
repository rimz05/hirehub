import { messageInRaw } from "svix"
import JobApplication from "../modals/JobApplication.js"
import User from "../modals/User.js"
import Job from "../modals/Job.js"
import { v2 as cloudinary} from "cloudinary"

// get user data
export const getUserData = async(req, res)=>{

    const userId = req.auth.userId
    try{

        const user = await User.findById(userId)
        if(!user){
            return res.json({success:false, message: 'user not found'})
        }
        res.json({success: true, user})

    }catch(error){
        console.log({success: false, message: error.message})
    }
}

// apply for jobs
export const appForJobs = async(req, res)=>{
    const {jobId }= req.body
    const userId = req.auth.userId

    try{
        const isAlreadyApplied = await JobApplication.find({jobId, userId})

        if(isAlreadyApplied.length> 0){
            return res.json({success:false, message:'Already Applied'})
        }

        const jobData = await Job.findById(jobId)

        if(!jobData){
            return res.json({success:false, message:"Job not found"})
        }

        await JobApplication.create({

            companyId: jobData.companyId,
            userId, 
            jobId,
            dote: Date.now()
        })

        res.json({ success: true, message: 'Applied Successfully'})

    }catch(error){
        console.log({success: false, message: error.message})
    }

}


// get user application
export const getUserJobApplication = async(req, res)=>{
    try{
        const userId = req.auth.userId
        const application = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary').exec()

        if(!application){
            res.json({ success: false, message: 'no, job application'})
        }
        res.json({ success: true, application})


    }catch(error){
        console.log({success: false, message: error.message})
    }

}

// update user profile(resume)
export const updateUserResume = async(req, res)=>{

    try{
        const userId = req.auth.userId
        const resumeFile = req.resumeFile

        const userData = await User.findById(userId)

        if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url
        }
        await userData.save()

        return res.json({ success: true, message: 'Resume Updated'})

    }catch(error){

        console.log({success: false, message: error.message})
    }
}
