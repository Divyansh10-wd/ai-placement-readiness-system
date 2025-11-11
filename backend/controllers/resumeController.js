const Resume = require('../models/Resume');
const OpenAI = require('openai');
const { parseLatexToResume, convertResumeToLatex } = require('../utils/latexConverter');
const pdfParse = require('pdf-parse');

// Initialize OpenAI client (for backward compatibility)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Initialize Groq AI client (using OpenAI SDK with custom base URL)
const groqAI = process.env.GROQ_API_KEY ? new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
}) : null;

// Log Groq AI initialization status
if (groqAI) {
  console.log('✅ Groq AI client initialized successfully');
} else {
  console.warn('⚠️ Groq AI client NOT initialized - GROQ_API_KEY missing');
}

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

// Analyze resume text using Grok AI
exports.analyzeResumeText = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resume text is required' 
      });
    }

    if (!groqAI) {
      return res.status(503).json({ 
        success: false, 
        message: 'Groq AI service not available. Please configure GROQ_API_KEY.' 
      });
    }

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed, actionable feedback.

Resume:
${resumeText}

Please analyze this resume and provide:
1. An overall score out of 100 (considering content quality, formatting, achievements, keywords)
2. An ATS (Applicant Tracking System) compatibility score out of 100
3. An impact score out of 100 (how impactful and achievement-oriented the content is)
4. Top 5 strengths of this resume
5. Top 5 weaknesses or areas for improvement
6. Top 7 specific, actionable recommendations to improve this resume

Format your response as JSON with this exact structure:
{
  "overallScore": 85,
  "atsScore": 90,
  "impactScore": 80,
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "weaknesses": ["weakness1", "weakness2", "weakness3", "weakness4", "weakness5"],
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5", "rec6", "rec7"]
}`;

    console.log('🔍 Starting Groq AI analysis...');
    console.log('📊 Resume text length:', resumeText.length);
    
    try {
      console.log('🚀 Calling Groq API...');
      console.log('🔑 API Key present:', !!process.env.GROQ_API_KEY);
      console.log('🔑 API Key prefix:', process.env.GROQ_API_KEY?.substring(0, 10) + '...');
      
      const completion = await groqAI.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert resume reviewer and career coach. Always respond with valid JSON only, no additional text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log('✅ Groq API response received');
      console.log('📝 Response preview:', completion.choices[0].message.content.substring(0, 200));

      let analysis;
      try {
        const responseContent = completion.choices[0].message.content.trim();
        // Remove markdown code blocks if present
        const jsonContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        console.log('🔄 Parsing JSON response...');
        analysis = JSON.parse(jsonContent);
        console.log('✅ Successfully parsed analysis:', { overallScore: analysis.overallScore, atsScore: analysis.atsScore });
      } catch (parseError) {
        console.error('❌ Error parsing Groq AI response:', parseError);
        console.error('📄 Raw response:', completion.choices[0].message.content);
        // Fallback analysis
        analysis = {
          overallScore: 70,
          atsScore: 75,
          impactScore: 65,
          strengths: [
            "Resume contains relevant work experience",
            "Educational background is clearly stated",
            "Contact information is provided",
            "Skills section is present",
            "Professional formatting is used"
          ],
          weaknesses: [
            "Could use more quantifiable achievements",
            "Some sections lack specific details",
            "Keywords for ATS optimization could be improved",
            "Action verbs could be stronger",
            "Summary section could be more impactful"
          ],
          recommendations: [
            "Add quantifiable metrics to achievements (e.g., 'Increased sales by 30%')",
            "Use stronger action verbs (Led, Developed, Implemented, Achieved)",
            "Include industry-specific keywords for better ATS compatibility",
            "Add a compelling professional summary at the top",
            "Ensure consistent formatting throughout the document",
            "Highlight specific technologies and tools used",
            "Include links to portfolio, GitHub, or LinkedIn profile"
          ]
        };
      }

      console.log('✅ Sending analysis to client');
      res.json({ success: true, analysis });
    } catch (apiError) {
      console.error('❌ Groq AI API Error:', apiError);
      console.error('❌ Error details:', apiError.message);
      console.error('❌ Error status:', apiError.status);
      console.error('❌ Error code:', apiError.code);
      console.error('❌ Error type:', apiError.type);
      console.error('❌ Full error:', JSON.stringify(apiError, null, 2));
      
      // Fallback analysis for API errors
      const fallbackAnalysis = {
        overallScore: 70,
        atsScore: 70,
        impactScore: 65,
        strengths: [
          "Resume structure is present",
          "Contact information included",
          "Work experience section exists",
          "Education details provided",
          "Skills are listed"
        ],
        weaknesses: [
          "⚠️ AI analysis temporarily unavailable",
          "Consider adding quantifiable achievements",
          "Improve keyword optimization for ATS",
          "Strengthen action verbs in descriptions",
          "Add more specific technical details"
        ],
        recommendations: [
          "⚠️ Groq AI temporarily unavailable - showing generic suggestions",
          "Add measurable results with numbers and percentages",
          "Use industry-specific keywords throughout",
          "Start bullet points with strong action verbs",
          "Include a compelling professional summary",
          "Add relevant certifications and technical skills",
          "Ensure consistent formatting and professional language"
        ]
      };

      res.json({ success: true, analysis: fallbackAnalysis });
    }
  } catch (error) {
    console.error('Error analyzing resume text:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze resume', 
      error: error.message 
    });
  }
};

// Improve resume text using Grok AI
exports.improveResumeText = async (req, res) => {
  try {
    const { resumeText, analysisContext } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resume text is required' 
      });
    }

    if (!groqAI) {
      return res.status(503).json({ 
        success: false, 
        message: 'Groq AI service not available. Please configure GROQ_API_KEY.' 
      });
    }

    let contextInfo = '';
    if (analysisContext) {
      contextInfo = `\n\nPrevious Analysis Context:
- Overall Score: ${analysisContext.overallScore}/100
- ATS Score: ${analysisContext.atsScore}/100
- Key Weaknesses: ${analysisContext.weaknesses?.slice(0, 3).join(', ')}
- Top Recommendations: ${analysisContext.recommendations?.slice(0, 3).join(', ')}`;
    }

    const prompt = `You are an expert resume writer and career coach. Improve the following resume by making it more impactful, ATS-friendly, and achievement-oriented.${contextInfo}

Original Resume:
${resumeText}

Please improve this resume by:
1. Strengthening action verbs and making descriptions more impactful
2. Adding quantifiable achievements where appropriate (use realistic placeholders like [X%] if specific numbers aren't provided)
3. Optimizing for ATS with relevant keywords
4. Improving formatting and structure
5. Making the professional summary more compelling
6. Ensuring consistency in tense and formatting

Provide your response as JSON with this exact structure:
{
  "improvedText": "The complete improved resume text here",
  "keyChanges": ["change1", "change2", "change3", "change4", "change5"]
}

The improvedText should be the full resume, not just sections. The keyChanges should list the 5 most important improvements you made.`;

    console.log('🔍 Starting Groq AI improvement...');
    console.log('📊 Resume text length:', resumeText.length);
    
    try {
      console.log('🚀 Calling Groq API for improvement...');
      const completion = await groqAI.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert resume writer. Always respond with valid JSON only, no additional text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      console.log('✅ Groq API response received');
      console.log('📝 Response preview:', completion.choices[0].message.content.substring(0, 200));

      let improvement;
      try {
        const responseContent = completion.choices[0].message.content.trim();
        // Remove markdown code blocks if present
        const jsonContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        console.log('🔄 Parsing JSON response...');
        improvement = JSON.parse(jsonContent);
        console.log('✅ Successfully parsed improvement');
      } catch (parseError) {
        console.error('❌ Error parsing Groq AI response:', parseError);
        console.error('📄 Raw response:', completion.choices[0].message.content);
        // Fallback improvement
        improvement = {
          improvedText: resumeText + "\n\n[Note: AI improvement temporarily unavailable. Please try again later.]",
          keyChanges: [
            "⚠️ AI improvement service temporarily unavailable",
            "Original resume text preserved",
            "Please try again in a few moments",
            "Consider manually implementing the analysis recommendations",
            "Check your Groq API key configuration"
          ]
        };
      }

      console.log('✅ Sending improvement to client');
      res.json({ success: true, improvement });
    } catch (apiError) {
      console.error('❌ Groq AI API Error:', apiError);
      console.error('❌ Error details:', apiError.message);
      console.error('❌ Error status:', apiError.status);
      
      // Fallback improvement for API errors
      const fallbackImprovement = {
        improvedText: resumeText + "\n\n[Note: AI improvement temporarily unavailable. Please review the analysis recommendations and apply them manually.]",
        keyChanges: [
          "⚠️ Groq AI temporarily unavailable",
          "Original resume preserved",
          "Review analysis recommendations for manual improvements",
          "Ensure API key is configured correctly",
          "Try again later when service is available"
        ]
      };

      res.json({ success: true, improvement: fallbackImprovement });
    }
  } catch (error) {
    console.error('Error improving resume text:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to improve resume', 
      error: error.message 
    });
  }
};

// Analyze PDF resume file using Groq AI
exports.analyzePdfResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    console.log('📄 PDF file received:', req.file.originalname);
    console.log('📊 File size:', req.file.size, 'bytes');

    // Parse PDF to extract text
    let resumeText;
    try {
      console.log('🔄 Attempting to parse PDF...');
      console.log('📦 Buffer size:', req.file.buffer.length);
      console.log('📄 MIME type:', req.file.mimetype);
      
      // Validate file is actually a PDF
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid file type. Please upload a PDF file.' 
        });
      }
      
      // Parse PDF with basic options
      const pdfData = await pdfParse(req.file.buffer, {
        max: 0 // Parse all pages (0 = no limit)
      });
      
      resumeText = pdfData.text;
      
      // Clean up the extracted text
      resumeText = resumeText
        .replace(/\r\n/g, '\n') // Normalize line endings
        .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\n /g, '\n') // Remove spaces at start of lines
        .trim();
      
      console.log('✅ PDF parsed successfully');
      console.log('📝 Extracted text length:', resumeText.length);
      console.log('📄 Number of pages:', pdfData.numpages);
      console.log('📊 PDF info:', JSON.stringify(pdfData.info));
      console.log('📋 PDF metadata:', JSON.stringify(pdfData.metadata));
      
      // Log first 300 characters of extracted text for debugging
      if (resumeText) {
        console.log('📝 Text preview:', resumeText.substring(0, 300) + '...');
      }
    } catch (pdfError) {
      console.error('❌ PDF parsing error:', pdfError);
      console.error('❌ Error name:', pdfError.name);
      console.error('❌ Error message:', pdfError.message);
      console.error('❌ Error stack:', pdfError.stack);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to parse PDF file. ';
      if (pdfError.message.includes('Invalid PDF')) {
        errorMessage += 'The file appears to be corrupted or not a valid PDF.';
      } else if (pdfError.message.includes('Encrypted')) {
        errorMessage += 'The PDF is password-protected. Please upload an unprotected PDF.';
      } else if (pdfError.message.includes('end of file')) {
        errorMessage += 'The PDF file is incomplete or corrupted.';
      } else {
        errorMessage += 'Please ensure it\'s a valid PDF with text content (not a scanned image).';
      }
      
      return res.status(400).json({ 
        success: false, 
        message: errorMessage,
        errorDetails: pdfError.message
      });
    }

    if (!resumeText || !resumeText.trim()) {
      console.warn('⚠️ PDF parsed but no text extracted');
      return res.status(400).json({ 
        success: false, 
        message: 'No text content found in PDF. This might be a scanned document or image-based PDF. Please use a PDF with selectable text or paste your resume text instead.' 
      });
    }
    
    // Check if extracted text is too short (likely an issue)
    if (resumeText.trim().length < 50) {
      console.warn('⚠️ Very short text extracted:', resumeText.length, 'characters');
      return res.status(400).json({ 
        success: false, 
        message: `Only ${resumeText.length} characters extracted from PDF. This might be a scanned document or have formatting issues. Please try the "Paste Text" option instead.` 
      });
    }

    if (!groqAI) {
      return res.status(503).json({ 
        success: false, 
        message: 'Groq AI service not available. Please configure GROQ_API_KEY.' 
      });
    }

    const prompt = `You are an expert resume reviewer and career coach. Analyze the following resume and provide detailed, actionable feedback.

Resume:
${resumeText}

Please analyze this resume and provide:
1. An overall score out of 100 (considering content quality, formatting, achievements, keywords)
2. An ATS (Applicant Tracking System) compatibility score out of 100
3. An impact score out of 100 (how impactful and achievement-oriented the content is)
4. Top 5 strengths of this resume
5. Top 5 weaknesses or areas for improvement
6. Top 7 specific, actionable recommendations to improve this resume

Format your response as JSON with this exact structure:
{
  "overallScore": 85,
  "atsScore": 90,
  "impactScore": 80,
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "weaknesses": ["weakness1", "weakness2", "weakness3", "weakness4", "weakness5"],
  "recommendations": ["rec1", "rec2", "rec3", "rec4", "rec5", "rec6", "rec7"]
}`;

    console.log('🔍 Starting Groq AI analysis...');
    
    try {
      console.log('🚀 Calling Groq API...');
      const completion = await groqAI.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are an expert resume reviewer and career coach. Always respond with valid JSON only, no additional text." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      console.log('✅ Groq API response received');

      let analysis;
      try {
        const responseContent = completion.choices[0].message.content.trim();
        const jsonContent = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        analysis = JSON.parse(jsonContent);
        console.log('✅ Successfully parsed analysis');
      } catch (parseError) {
        console.error('❌ Error parsing Groq AI response:', parseError);
        analysis = {
          overallScore: 70,
          atsScore: 75,
          impactScore: 65,
          strengths: [
            "Resume contains relevant work experience",
            "Educational background is clearly stated",
            "Contact information is provided",
            "Skills section is present",
            "Professional formatting is used"
          ],
          weaknesses: [
            "Could use more quantifiable achievements",
            "Some sections lack specific details",
            "Keywords for ATS optimization could be improved",
            "Action verbs could be stronger",
            "Summary section could be more impactful"
          ],
          recommendations: [
            "Add quantifiable metrics to achievements (e.g., 'Increased sales by 30%')",
            "Use stronger action verbs (Led, Developed, Implemented, Achieved)",
            "Include industry-specific keywords for better ATS compatibility",
            "Add a compelling professional summary at the top",
            "Ensure consistent formatting throughout the document",
            "Highlight specific technologies and tools used",
            "Include links to portfolio, GitHub, or LinkedIn profile"
          ]
        };
      }

      res.json({ success: true, analysis, extractedText: resumeText });
    } catch (apiError) {
      console.error('❌ Groq AI API Error:', apiError);
      
      const fallbackAnalysis = {
        overallScore: 70,
        atsScore: 70,
        impactScore: 65,
        strengths: [
          "Resume structure is present",
          "Contact information included",
          "Work experience section exists",
          "Education details provided",
          "Skills are listed"
        ],
        weaknesses: [
          "⚠️ AI analysis temporarily unavailable",
          "Consider adding quantifiable achievements",
          "Improve keyword optimization for ATS",
          "Strengthen action verbs in descriptions",
          "Add more specific technical details"
        ],
        recommendations: [
          "⚠️ Groq AI temporarily unavailable - showing generic suggestions",
          "Add measurable results with numbers and percentages",
          "Use industry-specific keywords throughout",
          "Start bullet points with strong action verbs",
          "Include a compelling professional summary",
          "Add relevant certifications and technical skills",
          "Ensure consistent formatting and professional language"
        ]
      };

      res.json({ success: true, analysis: fallbackAnalysis, extractedText: resumeText });
    }
  } catch (error) {
    console.error('Error analyzing PDF resume:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to analyze resume', 
      error: error.message 
    });
  }
};
