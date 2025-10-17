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
