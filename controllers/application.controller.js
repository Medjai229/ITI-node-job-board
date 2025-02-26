import applicationModel from '../models/application.model.js';
import jobModel from '../models/job.model.js';
import resumeModel from '../models/resume.model.js';
import userModel from '../models/user.model.js';

export default class Application {
  static async applyJob(req, res) {
    try {
      // TODO: replace userId with req.userId
      const userId = '67be425b4ec595444e702a2b';

      // * Check if the job exists
      const { jobId } = req.params;
      const job = await jobModel.findById(jobId);

      if (!job) {
        return res.status(404).json({ message: 'job does not exist' });
      }

      // * Check if the token is valid
      if (!userId) {
        return res.status(401).json({ message: 'token is invalid' });
      }

      // * Check if the user posting the app exists and is a job-seeker
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      if (user.role !== 'job-seeker') {
        return res.status(403).json({ message: 'user is not a job-seeker' });
      }

      // * Check if the user already applied for the job
      const application = await applicationModel.findOne({
        job: jobId,
        applicant: userId,
      });

      if (application) {
        return res.status(403).json({ message: 'application already exists' });
      }

      // ? Check if the user has a resume
      const resume = await resumeModel.findOne({ user: userId });
      if (!resume) {
        return res
          .status(404)
          .json({ message: 'user must have a resume to apply' });
      }

      // * Check if the job is open to apply
      if (job.status === 'closed') {
        return res.status(403).json({ message: 'job is not open' });
      }

      const newApplication = await applicationModel.create({
        job: jobId,
        applicant: userId,
        resume: resume.id,
      });

      // * Created the application successfully
      return res.status(201).json(newApplication);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }

  static async getAllApplications(req, res) {
    try {
      // TODO: replace userId with req.userId
      const userId = '67be425b4ec595444e702a2b';

      // * Check if the token is valid
      if (!userId) {
        return res.status(401).json({ message: 'token is invalid' });
      }

      // * Check if the user posting the app exists and is a job-seeker
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'user does not exist' });
      }

      if (user.role !== 'job-seeker') {
        return res.status(403).json({ message: 'user is not a job-seeker' });
      }

      // * Get all applications for the user
      const applications = await applicationModel.find({ applicant: userId });

      // * Check that there is any applications
      if (!applications || !applications.length) {
        return res.status(200).json({ message: 'no applications were found' });
      }

      // * Return the user applications
      return res.status(200).json(applications);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message || 'internal server error' });
    }
  }
}
