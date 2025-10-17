const express = require('express');
const router = express.Router();
const { submitToJudge0 } = require('../controllers/submissionController');

router.post('/', submitToJudge0);

module.exports = router;
