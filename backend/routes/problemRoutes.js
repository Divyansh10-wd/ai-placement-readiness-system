const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { createProblem, getAllProblems, getProblemById, bulkCreateProblems } = require('../controllers/problemController');

router.get('/all', getAllProblems);
router.get('/:id', getProblemById);
router.post('/create', auth, createProblem);
router.post('/bulk-create', auth, bulkCreateProblems);

module.exports = router;
