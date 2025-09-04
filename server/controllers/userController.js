import { messageInRaw } from "svix"
import JobApplication from "../modals/JobApplication.js"
import User from "../modals/User.js"
import Job from "../modals/Job.js"
import { v2 as cloudinary} from "cloudinary"

// get user data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.log({ success: false, message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};


// apply for jobs
export const appForJobs = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const alreadyApplied = await JobApplication.findOne({ jobId, userId });
    if (alreadyApplied) {
      return res.json({ success: false, message: 'Already applied' });
    }

    const jobData = await Job.findById(jobId);
    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: 'Applied successfully' });
  } catch (error) {
    console.log({ success: false, message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};


// get user application
export const getUserJobApplication = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const applications = await JobApplication.find({ userId })
      .populate('companyId', 'name email image')
      .populate('jobId', 'title description location category level salary')
      .exec();

    if (!applications || applications.length === 0) {
      return res.json({ success: false, message: 'No job applications' });
    }

    res.json({ success: true, applications });
  } catch (error) {
    console.log({ success: false, message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};


// update user profile(resume)
export const updateUserResume = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const resumeFile = req.file; // If using multer or similar

    const userData = await User.findById(userId);

    if (!userData) return res.json({ success: false, message: 'User not found' });

    if (resumeFile) {
      const resumeUpload = await cloudinary.uploader.upload(resumeFile.path);
      userData.resume = resumeUpload.secure_url;
    }

    await userData.save();
    return res.json({ success: true, message: 'Resume updated', resume: userData.resume });
  } catch (error) {
    console.log({ success: false, message: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

