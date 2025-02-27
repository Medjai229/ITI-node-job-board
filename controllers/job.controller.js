import Job from '../models/job.model.js';

// Create a new job
export const createJob = async (req, res) => {
  try {
    const { title, description, salary_range, location } = req.body;

    // Check for required fields
    if (!title || !description || !salary_range || !location) {
      return res.status(400).json({ message: 'Please provide Title, Description, Salary Range, and Location' });
    }
    if (salary_range.min === undefined || salary_range.max === undefined) {
      return res.status(400).json({ message: 'Salary range must include both min and max values' });
    }

    // Validate field types
    if (typeof title !== 'string') {
      return res.status(400).json({ message: 'Title must be a string' });
    }
    if (typeof description !== 'string') {
      return res.status(400).json({ message: 'Description must be a string' });
    }
    if (typeof location !== 'string') {
      return res.status(400).json({ message: 'Location must be a string' });
    }
    if (typeof salary_range.min !== 'number' || typeof salary_range.max !== 'number') {
      return res.status(400).json({ message: 'Salary range values must be numbers' });
    }

    // Validate salary_range values
    if (salary_range.min < 0 || salary_range.max < 0) {
      return res.status(400).json({ message: 'Salary range values cannot be negative' });
    }
    if (salary_range.min > salary_range.max) {
      return res.status(400).json({ message: 'Minimum salary must be less than maximum salary' });
    }

    const newJob = new Job({
      title,
      description,
      salary_range,
      location,
      // employer middleware
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(500).json({ message: 'Sorry! Job is not created', error: error.message });
  }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'There are no Jobs at this time', error: error.message });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: 'There is no job with this id', error: error.message });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const { title, description, salary_range, location } = req.body;

    // Update fields
    const updatedData = {};
    if (title) {
      if (typeof title !== 'string') {
        return res.status(400).json({ message: 'Title must be a string' });
      }
      updatedData.title = title;
    }
    if (description) {
      if (typeof description !== 'string') {
        return res.status(400).json({ message: 'Description must be a string' });
      }
      updatedData.description = description;
    }
    if (location) {
      if (typeof location !== 'string') {
        return res.status(400).json({ message: 'Location must be a string' });
      }
      updatedData.location = location;
    }
    if (salary_range) {
      if (salary_range.min === undefined || salary_range.max === undefined) {
        return res.status(400).json({ message: 'Salary range must include both min and max values' });
      }
      if (typeof salary_range.min !== 'number' || typeof salary_range.max !== 'number') {
        return res.status(400).json({ message: 'Salary range values must be numbers' });
      }
      if (salary_range.min < 0 || salary_range.max < 0) {
        return res.status(400).json({ message: 'Salary range values cannot be negative' });
      }
      if (salary_range.min > salary_range.max) {
        return res.status(400).json({ message: 'Minimum salary must be less than maximum salary' });
      }
      updatedData.salary_range = salary_range;
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the job', error: error.message });
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Job does not exist!', error: error.message });
  }
};

//delete all jobs

export const deleteAllJobs = async (req, res) => {
  try {
    const result = await Job.deleteMany({});
    res.status(200).json({ 
      message: 'All jobs deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'An error occurred while deleting all jobs', 
      error: error.message 
    });
  }
};