import { application } from "express"
import Company from "../modals/Company.js";
import bcrypt from 'bcrypt'
import {v2 as cloudnary} from 'cloudinary'
import generateToken from "../utils/generateTokens.js";
import Job from "../modals/Job.js";

// register new company 
export const registerCompany = async (req,res) =>{
    const {name, email,password} = req.body

    const imageFile = req.file;

    if(!name|| !email || !password || !imageFile){
        return res.json({success:false, message:"Missing Details"})
    }

    try{
        const companyExist = await Company.findOne({email})
        if(companyExist){
          return res.json({success:false, message:'Company already registered'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUplaod = await cloudnary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name, 
            email,
            password:hashPassword,
            image:imageUplaod.secure_url

        })
        res.json({
            success:true,
            company:{
                _id: company.id,
                name:company.name,
                email: company.email,
                image:company.image
            },
            token: generateToken(company._id)

        })

    }catch(error){
        if (error.code === 11000 && error.keyPattern?.email) {
            return res.json({ success: false, message: "Email already exists. Please login instead." });
          }
        res.json({success:false, message:error.message})
    }

}


// company login
export const loginCompany = async (req, res) => {
    const { email, password } = req.body;

    try {
        const company = await Company.findOne({ email });

        if (company && await bcrypt.compare(password, company.password)) {
            res.json({
                success: true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            });
        } else {
            res.json({
                success: false,
                message: 'Invalid email or password'
            });
        }

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// get company data
export const getCompanyData = async(req,res) =>{
    try {
        const company = req.company;
        res.json({ success: true, company });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
     
}

// post new job
export const postJob = async(req,res) =>{
    const{title, description, location, salary,level,category} = req.body

    const companyId  = req.company._id 

    try{
        const newJob = Job({
            title, description, location, salary,
            companyId, date:Date.now(),level,category
        })
        await newJob.save();
         res.json({success:true, newJob})
    }catch (error) {
        res.json({ 
            success: false,
            message: error.message
        });
    }

}

// get company job application
export const getCompanyJobApplicants = async (req, res) => {
    
};


// get company posted jobs
export const getCompanyPostedJobs = async(req,res) =>{

    try{
        const companyId = req.company._id
        const jobs = await Job.find({companyId})
        
        // (todo) adding no. of applicants info in data
        const jobData = await Promise.all(JobLocations.map(async (job)=>{

            const applicants = await JobApplication.find({jobId: job._id})
            return {...job.toObject(), applicants : applicants.length}
        }))


        res.json({success:true, jobData})

    }catch(error){
        res.json({ 
            success: false,
            message: error.message
        });
    }
     
}

// change job application status
export const ChangeJobApplicationStatus = async(req,res) =>{
     
}

// change job visibility
export const ChangeVisbilility = async(req,res) =>{

    try{

        const {id} = req.body
        const companyId = req.company._id
        const job = await Job.findById(id)
         
        if (!job) {
            return res.json({ success: false, message: "Job not found" });
        }

        if (companyId.toString() === job.companyId.toString()) {
            job.visible = !job.visible;
            await job.save();
            res.json({ success: true, job });
        } else {
            res.json({ success: false, message: "Unauthorized action" });
        }

    }catch(error){
        res.json({ 
            success: false,
            message: error.message
        });
    }
     
}