const Problem = require('../models/Problem');

exports.createProblem = async (req, res) => {
  try {
    const {
      title,
      statement,
      inputFormat,
      outputFormat,
      constraints,
      samples,
      hiddenTests,
      timeLimitMs,
      memoryLimitMB,
      publisherName,
    } = req.body;

    if (!title || !statement) return res.status(400).json({ message: 'Missing fields' });

    const problem = await Problem.create({
      title,
      statement,
      inputFormat,
      outputFormat,
      constraints,
      samples: samples || [],
      hiddenTests: hiddenTests || [],
      timeLimitMs,
      memoryLimitMB,
      publisherId: req.user?.id,
      publisherName: publisherName || req.user?.name,
    });

    const { hiddenTests: _, ...safe } = problem.toObject();
    res.status(201).json(safe);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-hiddenTests');
    res.json(problems);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select('-hiddenTests');
    if (!problem) return res.status(404).json({ message: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Bulk create problems
exports.bulkCreateProblems = async (req, res) => {
  try {
    const { problems } = req.body;
    
    if (!Array.isArray(problems) || problems.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of problems' });
    }

    const createdProblems = [];
    const errors = [];

    for (let i = 0; i < problems.length; i++) {
      try {
        const problemData = problems[i];
        
        // Add publisher info
        problemData.publisherId = req.user?.id;
        problemData.publisherName = problemData.publisherName || req.user?.name || 'Anonymous';
        
        // Set defaults
        problemData.timeLimitMs = problemData.timeLimitMs || 2000;
        problemData.memoryLimitMB = problemData.memoryLimitMB || 256;
        problemData.samples = problemData.samples || [];
        problemData.hiddenTests = problemData.hiddenTests || [];
        
        const problem = await Problem.create(problemData);
        const { hiddenTests: _, ...safe } = problem.toObject();
        createdProblems.push(safe);
      } catch (err) {
        errors.push({
          index: i,
          title: problems[i]?.title || 'Unknown',
          error: err.message
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Created ${createdProblems.length} out of ${problems.length} problems`,
      created: createdProblems.length,
      failed: errors.length,
      problems: createdProblems,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    console.error('Error bulk creating problems:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
