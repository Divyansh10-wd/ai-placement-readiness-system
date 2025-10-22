const Resume = require('../models/Resume');
const OpenAI = require('openai');
const { parseLatexToResume, convertResumeToLatex } = require('../utils/latexConverter');

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Create a new resume
exports.createResume = async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      userId: req.user.id
    });
    
    await resume.save();
    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ success: false, message: 'Failed to create resume', error: error.message });
  }
};

// Get all resumes for the logged-in user
exports.getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, resumes });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resumes', error: error.message });
  }
};

// Get a specific resume by ID
exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json({ success: true, resume });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch resume', error: error.message });
  }
};

// Update a resume
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json({ success: true, resume });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ success: false, message: 'Failed to update resume', error: error.message });
  }
};

// Delete a resume
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }
    
    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, message: 'Failed to delete resume', error: error.message });
  }
};

// AI-powered resume analysis and suggestions
exports.analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (!openai) {
      return res.status(503).json({ 
        success: false, 
        message: 'AI service not available. Please configure OPENAI_API_KEY.' 
      });
    }

    // Prepare resume content for AI analysis
    const resumeContent = `
Name: ${resume.personalInfo.fullName}
Summary: ${resume.personalInfo.summary || 'Not provided'}

Experience:
${resume.experience.map((exp, i) => `
${i + 1}. ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})
   ${exp.description.join('\n   ')}
   Technologies: ${exp.technologies.join(', ')}
`).join('\n')}

Education:
${resume.education.map(edu => `
- ${edu.degree} in ${edu.field} from ${edu.institution}
  ${edu.achievements ? edu.achievements.join('\n  ') : ''}
`).join('\n')}

Projects:
${resume.projects.map(proj => `
- ${proj.name}: ${proj.description}
  Technologies: ${proj.technologies.join(', ')}
  ${proj.highlights ? proj.highlights.join('\n  ') : ''}
`).join('\n')}

Skills:
Technical: ${resume.skills.technical.join(', ')}
Frameworks: ${resume.skills.frameworks.join(', ')}
Tools: ${resume.skills.tools.join(', ')}
`;

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed feedback.

${resumeContent}

Please provide:
1. An improved professional summary (2-3 sentences)
2. Top 5 skills that should be added based on the experience
3. Specific improvements for each experience entry (be concise)
4. An overall resume score out of 100
5. An ATS (Applicant Tracking System) compatibility score out of 100
6. Top 5 actionable improvements

Format your response as JSON with this structure:
{
  "summaryImprovement": "improved summary text",
  "skillsToAdd": ["skill1", "skill2", ...],
  "experienceImprovements": [
    {"index": 0, "suggestions": ["suggestion1", "suggestion2"]},
    ...
  ],
  "overallScore": 85,
  "atsScore": 90,
  "improvements": ["improvement1", "improvement2", ...]
}`;

    let aiSuggestions;
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert resume reviewer. Always respond with valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      try {
        aiSuggestions = JSON.parse(completion.choices[0].message.content);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback suggestions
        aiSuggestions = {
          summaryImprovement: "Consider adding a professional summary that highlights your key achievements and career goals.",
          skillsToAdd: ["Communication", "Problem Solving", "Team Collaboration"],
          experienceImprovements: [],
          overallScore: 70,
          atsScore: 75,
        improvements: [
          "Add quantifiable achievements to your experience",
          "Include relevant keywords for ATS optimization",
          "Ensure consistent formatting throughout",
          "Add a professional summary at the top",
          "Include links to your portfolio or GitHub"
        ]
      };
    }
    } catch (apiError) {
      console.error('OpenAI API Error:', apiError);
      
      // Handle quota exceeded or other API errors with fallback suggestions
      if (apiError.status === 429 || apiError.code === 'insufficient_quota') {
        aiSuggestions = {
          summaryImprovement: "⚠️ AI Analysis temporarily unavailable (API quota exceeded). Manual review: Consider adding a compelling professional summary that highlights your unique value proposition and key achievements.",
          skillsToAdd: ["Leadership", "Communication", "Problem Solving", "Time Management", "Adaptability"],
          experienceImprovements: [
            {
              index: 0,
              suggestions: [
                "Add quantifiable metrics (e.g., 'Increased efficiency by 30%')",
                "Use strong action verbs (e.g., 'Led', 'Developed', 'Implemented')",
                "Focus on achievements rather than responsibilities"
              ]
            }
          ],
          overallScore: 75,
          atsScore: 70,
          improvements: [
            "⚠️ AI quota exceeded - showing generic suggestions",
            "Add measurable achievements with numbers and percentages",
            "Include industry-specific keywords for ATS optimization",
            "Ensure consistent formatting and professional language",
            "Add a strong professional summary at the top",
            "Include relevant certifications and technical skills"
          ]
        };
      } else {
        // Other API errors
        aiSuggestions = {
          summaryImprovement: "Unable to generate AI suggestions at this time. Please try again later.",
          skillsToAdd: [],
          experienceImprovements: [],
          overallScore: 70,
          atsScore: 70,
          improvements: ["AI analysis temporarily unavailable. Please check your API configuration."]
        };
      }
    }

    // Update resume with AI suggestions
    resume.aiSuggestions = aiSuggestions;
    await resume.save();

    res.json({ success: true, suggestions: aiSuggestions });
  } catch (error) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze resume', 
      error: error.message 
    });
  }
};

// AI-powered content generation for resume sections
exports.generateContent = async (req, res) => {
  try {
    const { section, context } = req.body;

    if (!openai) {
      return res.status(503).json({ 
        success: false, 
        message: 'AI service not available. Please configure OPENAI_API_KEY.' 
      });
    }

    let prompt = '';
    
    switch (section) {
      case 'summary':
        prompt = `Write a professional resume summary (2-3 sentences) for someone with the following background:
${context}

The summary should be impactful, highlight key strengths, and be ATS-friendly.`;
        break;
        
      case 'experience':
        prompt = `Write 3-5 professional bullet points for this work experience:
Position: ${context.position}
Company: ${context.company}
Responsibilities: ${context.description}

Use action verbs, quantify achievements where possible, and make it ATS-friendly.`;
        break;
        
      case 'project':
        prompt = `Write 2-4 professional bullet points highlighting the key aspects of this project:
Project: ${context.name}
Description: ${context.description}
Technologies: ${context.technologies}

Focus on impact, technical skills, and outcomes.`;
        break;
        
      default:
        return res.status(400).json({ success: false, message: 'Invalid section type' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional resume writer. Provide concise, impactful content." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const generatedContent = completion.choices[0].message.content.trim();
    
    res.json({ success: true, content: generatedContent });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate content', 
      error: error.message 
    });
  }
};

// Duplicate a resume
exports.duplicateResume = async (req, res) => {
  try {
    const originalResume = await Resume.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!originalResume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    const resumeData = originalResume.toObject();
    delete resumeData._id;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    resumeData.title = `${resumeData.title} (Copy)`;

    const newResume = new Resume(resumeData);
    await newResume.save();

    res.status(201).json({ success: true, resume: newResume });
  } catch (error) {
    console.error('Error duplicating resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to duplicate resume', 
      error: error.message 
    });
  }
};

// Get resume templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design with accent colors',
        preview: '/templates/modern-preview.png'
      },
      {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional layout',
        preview: '/templates/classic-preview.png'
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant with focus on content',
        preview: '/templates/minimal-preview.png'
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Corporate-friendly design for traditional industries',
        preview: '/templates/professional-preview.png'
      }
    ];

    res.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch templates', 
      error: error.message 
    });
  }
};

// Convert LaTeX to Resume JSON
exports.importFromLatex = async (req, res) => {
  try {
    const { latexCode } = req.body;
    
    if (!latexCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'LaTeX code is required' 
      });
    }

    const resumeData = parseLatexToResume(latexCode);
    resumeData.userId = req.user.id;
    
    // Log what was extracted for debugging
    console.log('Extracted data:', {
      name: resumeData.personalInfo.fullName,
      email: resumeData.personalInfo.email,
      experienceCount: resumeData.experience.length,
      educationCount: resumeData.education.length,
      skillsCount: resumeData.skills.technical.length
    });
    
    // Ensure required fields have at least default values
    if (!resumeData.personalInfo.fullName || resumeData.personalInfo.fullName.trim() === '') {
      console.log('Warning: Name not found in LaTeX, using default');
      resumeData.personalInfo.fullName = 'Imported Resume';
    }
    
    const resume = new Resume(resumeData);
    await resume.save();

    res.json({ 
      success: true, 
      resume,
      message: 'Resume imported from LaTeX successfully' 
    });
  } catch (error) {
    console.error('Error importing from LaTeX:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to import from LaTeX. Please ensure your LaTeX follows the standard format.', 
      error: error.message 
    });
  }
};

// Convert Resume to LaTeX
exports.exportToLatex = async (req, res) => {
  try {
    const resume = await Resume.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });
    
    if (!resume) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resume not found' 
      });
    }

    const latexCode = convertResumeToLatex(resume);

    res.json({ 
      success: true, 
      latexCode,
      message: 'Resume exported to LaTeX successfully' 
    });
  } catch (error) {
    console.error('Error exporting to LaTeX:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to export to LaTeX', 
      error: error.message 
    });
  }
};

// Preview LaTeX conversion without saving
exports.previewLatexImport = async (req, res) => {
  try {
    const { latexCode } = req.body;
    
    if (!latexCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'LaTeX code is required' 
      });
    }

    const resumeData = parseLatexToResume(latexCode);

    res.json({ 
      success: true, 
      resumeData,
      message: 'LaTeX parsed successfully' 
    });
  } catch (error) {
    console.error('Error previewing LaTeX:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to parse LaTeX', 
      error: error.message 
    });
  }
};
