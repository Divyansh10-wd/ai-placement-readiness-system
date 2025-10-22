const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

// Resume CRUD operations
router.post('/', resumeController.createResume);
router.get('/', resumeController.getUserResumes);
router.get('/templates', resumeController.getTemplates);
router.get('/:id', resumeController.getResumeById);
router.put('/:id', resumeController.updateResume);
router.delete('/:id', resumeController.deleteResume);

// AI-powered features
router.post('/:id/analyze', resumeController.analyzeResume);
router.post('/generate-content', resumeController.generateContent);
router.post('/:id/duplicate', resumeController.duplicateResume);

// LaTeX conversion features
router.post('/import-latex', resumeController.importFromLatex);
router.post('/preview-latex', resumeController.previewLatexImport);
router.get('/:id/export-latex', resumeController.exportToLatex);

module.exports = router;
