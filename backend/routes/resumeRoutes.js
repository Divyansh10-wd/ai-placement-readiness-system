const express = require('express');
const router = express.Router();
const multer = require('multer');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middlewares/authMiddleware');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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

// Grok AI-powered resume analysis and improvement
router.post('/analyze-text', resumeController.analyzeResumeText);
router.post('/improve-text', resumeController.improveResumeText);
router.post('/analyze-pdf', upload.single('file'), resumeController.analyzePdfResume);

// LaTeX conversion features
router.post('/import-latex', resumeController.importFromLatex);
router.post('/preview-latex', resumeController.previewLatexImport);
router.get('/:id/export-latex', resumeController.exportToLatex);

module.exports = router;
