const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createProblem, getAllProblems, getProblemById } = require('../controllers/problemController');

router.get('/all', getAllProblems);
router.get('/:id', getProblemById);
router.post('/create', auth, createProblem);

module.exports = router;
