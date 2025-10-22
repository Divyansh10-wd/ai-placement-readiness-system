// LaTeX to Resume JSON converter
const parseLatexToResume = (latexCode) => {
  const resume = {
    title: 'Imported from LaTeX',
    template: 'classic',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    education: [],
    projects: [],
    skills: {
      technical: [],
      languages: [],
      frameworks: [],
      tools: [],
      soft: []
    },
    certifications: [],
    achievements: []
  };

  try {
    // Clean up the LaTeX code - remove comments
    latexCode = latexCode.replace(/%.*/g, '');
    
    // Extract name - try multiple patterns
    let nameMatch = latexCode.match(/\\name\{([^}]+)\}/);
    if (!nameMatch) {
      // Try to find name in center environment with scshape
      nameMatch = latexCode.match(/\\textbf\{\\(?:Huge|LARGE|Large)\s+\\scshape\s+([^}]+)\}/);
    }
    if (!nameMatch) {
      // Try pattern: {\Huge \textbf{Name}}
      nameMatch = latexCode.match(/\{\\Huge\s+\\textbf\{([^}]+)\}\}/);
    }
    if (!nameMatch) {
      // Try simpler pattern
      nameMatch = latexCode.match(/\\textbf\{\\Huge[^}]*\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\}/);
    }
    if (nameMatch) resume.personalInfo.fullName = nameMatch[1].trim();

    // Extract email - try multiple patterns
    let emailMatch = latexCode.match(/\\email\{([^}]+)\}/);
    if (!emailMatch) {
      emailMatch = latexCode.match(/\\href\{mailto:([^}]+)\}\{[^}]*\}/);
    }
    if (!emailMatch) {
      emailMatch = latexCode.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    }
    if (emailMatch) resume.personalInfo.email = emailMatch[1].trim();

    // Extract phone - try multiple patterns
    let phoneMatch = latexCode.match(/\\phone\{([^}]+)\}/);
    if (!phoneMatch) {
      phoneMatch = latexCode.match(/\\mobile\{([^}]+)\}/);
    }
    if (!phoneMatch) {
      phoneMatch = latexCode.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
    }
    if (phoneMatch) resume.personalInfo.phone = phoneMatch[1].trim();

    // Extract location/address
    const locationMatch = latexCode.match(/\\address\{([^}]+)\}|\\location\{([^}]+)\}/);
    if (locationMatch) resume.personalInfo.location = (locationMatch[1] || locationMatch[2]).trim();

    // Extract LinkedIn
    const linkedinMatch = latexCode.match(/linkedin\.com\/in\/([^}\s]+)|\\linkedin\{([^}]+)\}/);
    if (linkedinMatch) {
      const username = linkedinMatch[1] || linkedinMatch[2];
      resume.personalInfo.linkedin = username.includes('http') ? username : `https://linkedin.com/in/${username}`;
    }

    // Extract GitHub
    const githubMatch = latexCode.match(/github\.com\/([^}\s]+)|\\github\{([^}]+)\}/);
    if (githubMatch) {
      const username = githubMatch[1] || githubMatch[2];
      resume.personalInfo.github = username.includes('http') ? username : `https://github.com/${username}`;
    }

    // Extract summary/objective - handle both \section and \section*
    const summaryMatch = latexCode.match(/\\section\*?\{(?:Summary|Objective|Profile)\}[\s\S]*?\\begin\{quote\}([\s\S]*?)\\end\{quote\}|\\section\*?\{(?:Summary|Objective|Profile)\}\s*\n([^\n\\]*(?:\n(?!\\section)[^\n\\]*)*)/i);
    if (summaryMatch) {
      resume.personalInfo.summary = (summaryMatch[1] || summaryMatch[2]).trim().replace(/\\textit\{|\}/g, '');
    }

    // Extract Experience - handle both \section and \section*
    const experienceSection = latexCode.match(/\\section\*?\{(?:Experience|Work Experience|Employment|Internship Experience)\}([\s\S]*?)(?=\\section|\\end\{document\}|$)/i);
    if (experienceSection) {
      const expContent = experienceSection[1];
      
      // Try to match \textbf{Title, Company} \hfill dates format
      const simpleExpRegex = /\\textbf\{([^}]+)\}\s*\\hfill\s*([^\n]+)\n\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g;
      let simpleMatch;
      
      while ((simpleMatch = simpleExpRegex.exec(expContent)) !== null) {
        const titleCompany = simpleMatch[1].trim();
        const dates = simpleMatch[2].trim();
        const items = simpleMatch[3];
        
        // Parse title and company
        const parts = titleCompany.split(',');
        const position = parts[0]?.trim() || titleCompany;
        const company = parts[1]?.trim() || '';
        
        // Parse dates
        const dateParts = dates.split('--');
        const startDate = dateParts[0]?.trim() || dates;
        const endDate = dateParts[1]?.trim() || '';
        
        // Extract bullet points
        const bulletRegex = /\\item\s+([^\n]+(?:\n(?!\\item)[^\n]+)*)/g;
        const description = [];
        let bulletMatch;
        while ((bulletMatch = bulletRegex.exec(items)) !== null) {
          description.push(bulletMatch[1].trim());
        }
        
        const exp = {
          company: company,
          location: '',
          position: position,
          startDate: startDate,
          endDate: endDate,
          current: dates.toLowerCase().includes('present'),
          description: description,
          technologies: []
        };
        resume.experience.push(exp);
      }
      
      // If no simple format found, try resumeSubheading format
      if (resume.experience.length === 0) {
      
      // Try to match resumeSubheading format (more common)
      const subheadingRegex = /\\resumeSubheading\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/g;
      let match;
      let lastExp = null;
      
      while ((match = subheadingRegex.exec(expContent)) !== null) {
        const exp = {
          company: match[1].trim(),
          location: match[2].trim(),
          position: match[3].trim(),
          startDate: match[4].split('--')[0].trim(),
          endDate: match[4].split('--')[1]?.trim() || match[4].trim(),
          current: match[4].toLowerCase().includes('present'),
          description: [],
          technologies: []
        };
        resume.experience.push(exp);
        lastExp = exp;
      }
      
      // Extract description items for each experience
      const itemRegex = /\\resumeItem\{([^}]*)\}/g;
      let itemMatch;
      let expIndex = 0;
      
      while ((itemMatch = itemRegex.exec(expContent)) !== null) {
        if (resume.experience[expIndex]) {
          const desc = itemMatch[1].trim();
          if (desc && !desc.startsWith('\\textbf')) {
            resume.experience[expIndex].description.push(desc);
          }
        }
      }
      
      // Try cventry format as fallback
      if (resume.experience.length === 0) {
        const cventryRegex = /\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g;
        while ((match = cventryRegex.exec(expContent)) !== null) {
          const exp = {
            position: match[2].trim(),
            company: match[3].trim(),
            location: match[4].trim(),
            startDate: match[1].split('--')[0].trim(),
            endDate: match[1].split('--')[1]?.trim() || '',
            current: match[1].toLowerCase().includes('present'),
            description: match[6] ? match[6].split('\\item').filter(d => d.trim()).map(d => d.trim().replace(/[{}]/g, '')) : [],
            technologies: []
          };
          resume.experience.push(exp);
        }
      }
      }
    }

    // Extract Education - handle both \section and \section*
    const educationSection = latexCode.match(/\\section\*?\{Education\}([\s\S]*?)(?=\\section|\\end\{document\}|$)/i);
    if (educationSection) {
      const eduContent = educationSection[1];
      
      // Try to match \textbf{Degree}, Institution \hfill dates format
      const simpleEduRegex = /\\textbf\{([^}]+)\},\s*([^\n\\]+)\s*\\hfill\s*([^\n]+)/g;
      let simpleEduMatch;
      
      while ((simpleEduMatch = simpleEduRegex.exec(eduContent)) !== null) {
        const degree = simpleEduMatch[1].trim();
        const institution = simpleEduMatch[2].trim();
        const dates = simpleEduMatch[3].trim();
        
        // Parse dates
        const dateParts = dates.split('--');
        const startDate = dateParts[0]?.trim() || dates;
        const endDate = dateParts[1]?.trim() || '';
        
        const edu = {
          institution: institution,
          location: '',
          degree: degree,
          field: '',
          startDate: startDate,
          endDate: endDate,
          gpa: '',
          achievements: []
        };
        resume.education.push(edu);
      }
      
      // If no simple format found, try resumeSubheading format
      if (resume.education.length === 0) {
      
      // Try resumeSubheading format first
      const subheadingRegex = /\\resumeSubheading\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}\s*\{([^}]*)\}/g;
      let match;
      
      while ((match = subheadingRegex.exec(eduContent)) !== null) {
        const edu = {
          institution: match[1].trim(),
          location: match[2].trim(),
          degree: match[3].trim(),
          field: '',
          startDate: match[4].split('--')[0].trim(),
          endDate: match[4].split('--')[1]?.trim() || match[4].trim(),
          gpa: '',
          achievements: []
        };
        
        // Try to extract field from degree string
        const fieldMatch = edu.degree.match(/in\s+([^,]+)/i);
        if (fieldMatch) {
          edu.field = fieldMatch[1].trim();
        }
        
        resume.education.push(edu);
      }
      
      // Try cventry format as fallback
      if (resume.education.length === 0) {
        const cventryRegex = /\\cventry\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}\{([^}]*)\}/g;
        while ((match = cventryRegex.exec(eduContent)) !== null) {
          const edu = {
            degree: match[2].trim(),
            institution: match[3].trim(),
            location: match[4].trim(),
            field: match[5].trim(),
            startDate: match[1].split('--')[0].trim(),
            endDate: match[1].split('--')[1]?.trim() || '',
            gpa: '',
            achievements: []
          };
          resume.education.push(edu);
        }
      }
      }
    }

    // Extract Projects - handle both \section and \section*
    const projectsSection = latexCode.match(/\\section\*?\{Projects\}([\s\S]*?)(?=\\section|\\end\{document\}|$)/i);
    if (projectsSection) {
      const projContent = projectsSection[1];
      
      // Try to match \textbf{Project Name} \hfill dates format
      const simpleProjRegex = /\\textbf\{([^}]+)\}\s*\\hfill\s*([^\n]+)\n\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}\s*(?:\\textit\{Technologies:\s*([^}]+)\})?/g;
      let simpleProjMatch;
      
      while ((simpleProjMatch = simpleProjRegex.exec(projContent)) !== null) {
        const name = simpleProjMatch[1].trim();
        const dates = simpleProjMatch[2].trim();
        const items = simpleProjMatch[3];
        const techLine = simpleProjMatch[4];
        
        // Extract bullet points
        const bulletRegex = /\\item\s+([^\n]+(?:\n(?!\\item)[^\n]+)*)/g;
        const highlights = [];
        let bulletMatch;
        while ((bulletMatch = bulletRegex.exec(items)) !== null) {
          highlights.push(bulletMatch[1].trim());
        }
        
        // Extract technologies
        const technologies = techLine ? techLine.split(',').map(t => t.trim()).filter(Boolean) : [];
        
        const proj = {
          name: name,
          link: '',
          description: highlights[0] || '',
          highlights: highlights,
          technologies: technologies,
          startDate: dates.split('--')[0]?.trim() || '',
          endDate: dates.split('--')[1]?.trim() || dates
        };
        resume.projects.push(proj);
      }
      
      // If no simple format found, try resumeProjectHeading format
      if (resume.projects.length === 0) {
      
      const projRegex = /\\resumeProjectHeading\{\\textbf\{([^}]*)\}[^}]*\}\{([^}]*)\}([\s\S]*?)(?=\\resumeProjectHeading|\\section|$)|\\project\{([^}]*)\}\{([^}]*)\}([\s\S]*?)(?=\\project|\\section|$)/g;
      let match;
      
      while ((match = projRegex.exec(projContent)) !== null) {
        const proj = {
          name: (match[1] || match[4]).trim(),
          description: '',
          technologies: [],
          link: match[2] || match[5] || '',
          github: '',
          highlights: []
        };
        
        const desc = match[3] || match[6];
        if (desc) {
          const items = desc.split('\\resumeItem').filter(d => d.trim());
          proj.highlights = items.map(d => d.trim().replace(/[{}]/g, ''));
          if (proj.highlights.length > 0) {
            proj.description = proj.highlights[0];
          }
        }
        
        resume.projects.push(proj);
      }
      }
    }

    // Extract Skills - handle both \section and \section*
    const skillsSection = latexCode.match(/\\section\*?\{(?:Skills|Technical Skills)\}([\s\S]*?)(?=\\section|\\end\{document\}|$)/i);
    if (skillsSection) {
      const skillsContent = skillsSection[1];
      
      // Try to extract categorized skills with \item \textbf{Category:} format
      const itemSkillsRegex = /\\item\s+\\textbf\{([^}:]+):\}\s*([^\n]+)/g;
      let itemMatch;
      
      while ((itemMatch = itemSkillsRegex.exec(skillsContent)) !== null) {
        const category = itemMatch[1].trim().toLowerCase();
        const skills = itemMatch[2].split(',').map(s => s.trim()).filter(Boolean);
        
        if (category.includes('language')) {
          resume.skills.technical = resume.skills.technical.concat(skills);
        } else if (category.includes('framework')) {
          resume.skills.frameworks = resume.skills.frameworks.concat(skills);
        } else if (category.includes('tool') || category.includes('cloud')) {
          resume.skills.tools = resume.skills.tools.concat(skills);
        } else if (category.includes('machine learning') || category.includes('ml')) {
          resume.skills.tools = resume.skills.tools.concat(skills);
        } else {
          resume.skills.technical = resume.skills.technical.concat(skills);
        }
      }
      
      // If no items found, try other patterns
      if (resume.skills.technical.length === 0 && resume.skills.frameworks.length === 0 && resume.skills.tools.length === 0) {
      
      // Try to extract categorized skills with various patterns
      const techMatch = skillsContent.match(/\\textbf\{(?:Languages|Programming|Technical)\}\s*\{?\s*:\s*([^}\\]+)\}?/i);
      if (techMatch) {
        resume.skills.technical = techMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
      }
      
      const frameworkMatch = skillsContent.match(/\\textbf\{(?:Frameworks|Libraries)\}\s*\{?\s*:\s*([^}\\]+)\}?/i);
      if (frameworkMatch) {
        resume.skills.frameworks = frameworkMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
      }
      
      const toolsMatch = skillsContent.match(/\\textbf\{(?:Tools|Technologies|Developer Tools)\}\s*\{?\s*:\s*([^}\\]+)\}?/i);
      if (toolsMatch) {
        resume.skills.tools = toolsMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
      }
      
      // If no categorization found, try to extract from item environment
      if (resume.skills.technical.length === 0 && resume.skills.frameworks.length === 0 && resume.skills.tools.length === 0) {
        // Extract content from \item{...}
        const itemMatch = skillsContent.match(/\\item\s*\{([\s\S]*?)\}/);
        if (itemMatch) {
          const itemContent = itemMatch[1];
          
          // Try to find categorized skills within the item
          const langMatch = itemContent.match(/\\textbf\{Languages\}\s*\{?\s*:\s*([^}\\]+)/i);
          if (langMatch) {
            resume.skills.technical = langMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
          }
          
          const fwMatch = itemContent.match(/\\textbf\{Frameworks\}\s*\{?\s*:\s*([^}\\]+)/i);
          if (fwMatch) {
            resume.skills.frameworks = fwMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
          }
          
          const tlMatch = itemContent.match(/\\textbf\{Tools\}\s*\{?\s*:\s*([^}\\]+)/i);
          if (tlMatch) {
            resume.skills.tools = tlMatch[1].split(/[,;]/).map(s => s.trim()).filter(Boolean);
          }
        }
      }
      
      // Last resort: extract all comma-separated values
      if (resume.skills.technical.length === 0 && resume.skills.frameworks.length === 0 && resume.skills.tools.length === 0) {
        const cleanedContent = skillsContent
          .replace(/\\textbf\{[^}]*\}/g, '')
          .replace(/\\[a-zA-Z]+/g, '')
          .replace(/[{}]/g, '')
          .replace(/:/g, ',');
        const allSkills = cleanedContent.split(/[,;]/).map(s => s.trim()).filter(s => s && s.length > 1);
        resume.skills.technical = allSkills;
      }
      }
    }

  } catch (error) {
    console.error('Error parsing LaTeX:', error);
    throw new Error('Failed to parse LaTeX code. Please ensure it follows a standard resume format.');
  }

  return resume;
};

// Resume JSON to LaTeX converter
const convertResumeToLatex = (resume) => {
  const latex = [];
  
  // Document class and packages
  latex.push('\\documentclass[letterpaper,11pt]{article}');
  latex.push('');
  latex.push('\\usepackage{latexsym}');
  latex.push('\\usepackage[empty]{fullpage}');
  latex.push('\\usepackage{titlesec}');
  latex.push('\\usepackage{marvosym}');
  latex.push('\\usepackage[usenames,dvipsnames]{color}');
  latex.push('\\usepackage{verbatim}');
  latex.push('\\usepackage{enumitem}');
  latex.push('\\usepackage[hidelinks]{hyperref}');
  latex.push('\\usepackage{fancyhdr}');
  latex.push('\\usepackage[english]{babel}');
  latex.push('\\usepackage{tabularx}');
  latex.push('');
  latex.push('\\pagestyle{fancy}');
  latex.push('\\fancyhf{}');
  latex.push('\\fancyfoot{}');
  latex.push('\\renewcommand{\\headrulewidth}{0pt}');
  latex.push('\\renewcommand{\\footrulewidth}{0pt}');
  latex.push('');
  latex.push('\\addtolength{\\oddsidemargin}{-0.5in}');
  latex.push('\\addtolength{\\evensidemargin}{-0.5in}');
  latex.push('\\addtolength{\\textwidth}{1in}');
  latex.push('\\addtolength{\\topmargin}{-.5in}');
  latex.push('\\addtolength{\\textheight}{1.0in}');
  latex.push('');
  latex.push('\\urlstyle{same}');
  latex.push('');
  latex.push('\\raggedbottom');
  latex.push('\\raggedright');
  latex.push('\\setlength{\\tabcolsep}{0in}');
  latex.push('');
  latex.push('% Sections formatting');
  latex.push('\\titleformat{\\section}{');
  latex.push('  \\vspace{-4pt}\\scshape\\raggedright\\large');
  latex.push('}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]');
  latex.push('');
  
  // Custom commands (define before \begin{document})
  latex.push('% Custom commands');
  latex.push('\\newcommand{\\resumeItem}[1]{');
  latex.push('  \\item\\small{');
  latex.push('    {#1 \\vspace{-2pt}}');
  latex.push('  }');
  latex.push('}');
  latex.push('');
  latex.push('\\newcommand{\\resumeSubheading}[4]{');
  latex.push('  \\vspace{-2pt}\\item');
  latex.push('    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}');
  latex.push('      \\textbf{#1} & #2 \\\\');
  latex.push('      \\textit{\\small#3} & \\textit{\\small #4} \\\\');
  latex.push('    \\end{tabular*}\\vspace{-7pt}');
  latex.push('}');
  latex.push('');
  latex.push('\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}');
  latex.push('\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}');
  latex.push('\\newcommand{\\resumeItemListStart}{\\begin{itemize}}');
  latex.push('\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}');
  latex.push('\\newcommand{\\resumeProjectHeading}[2]{');
  latex.push('    \\item');
  latex.push('    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}');
  latex.push('      \\small#1 & #2 \\\\');
  latex.push('    \\end{tabular*}\\vspace{-7pt}');
  latex.push('}');
  latex.push('');
  
  latex.push('\\begin{document}');
  latex.push('');

  // Header with personal info
  latex.push('\\begin{center}');
  latex.push(`    \\textbf{\\Huge \\scshape ${escapeLatex(resume.personalInfo.fullName)}} \\\\ \\vspace{1pt}`);
  
  const contactInfo = [];
  if (resume.personalInfo.phone) contactInfo.push(escapeLatex(resume.personalInfo.phone));
  if (resume.personalInfo.email) contactInfo.push(`\\href{mailto:${resume.personalInfo.email}}{${escapeLatex(resume.personalInfo.email)}}`);
  if (resume.personalInfo.linkedin) contactInfo.push(`\\href{${resume.personalInfo.linkedin}}{LinkedIn}`);
  if (resume.personalInfo.github) contactInfo.push(`\\href{${resume.personalInfo.github}}{GitHub}`);
  if (resume.personalInfo.portfolio) contactInfo.push(`\\href{${resume.personalInfo.portfolio}}{Portfolio}`);
  
  if (contactInfo.length > 0) {
    latex.push(`    \\small ${contactInfo.join(' $|$ ')}`);
  }
  latex.push('\\end{center}');
  latex.push('');

  // Summary
  if (resume.personalInfo.summary) {
    latex.push('\\section{Summary}');
    latex.push(`${escapeLatex(resume.personalInfo.summary)}`);
    latex.push('');
  }

  // Education
  if (resume.education && resume.education.length > 0) {
    latex.push('\\section{Education}');
    latex.push('  \\resumeSubHeadingListStart');
    
    resume.education.forEach(edu => {
      latex.push('    \\resumeSubheading');
      latex.push(`      {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location || '')}}`);
      latex.push(`      {${escapeLatex(edu.degree)}${edu.field ? ` in ${escapeLatex(edu.field)}` : ''}}{${edu.startDate} -- ${edu.endDate}}`);
      if (edu.gpa) {
        latex.push(`      \\resumeItem{GPA: ${edu.gpa}}`);
      }
      if (edu.achievements && edu.achievements.length > 0) {
        edu.achievements.forEach(achievement => {
          latex.push(`      \\resumeItem{${escapeLatex(achievement)}}`);
        });
      }
    });
    
    latex.push('  \\resumeSubHeadingListEnd');
    latex.push('');
  }

  // Experience
  if (resume.experience && resume.experience.length > 0) {
    latex.push('\\section{Experience}');
    latex.push('  \\resumeSubHeadingListStart');
    
    resume.experience.forEach(exp => {
      latex.push('    \\resumeSubheading');
      latex.push(`      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location || '')}}`);
      latex.push(`      {${escapeLatex(exp.position)}}{${exp.startDate} -- ${exp.current ? 'Present' : exp.endDate}}`);
      latex.push('      \\resumeItemListStart');
      
      if (exp.description && exp.description.length > 0) {
        exp.description.forEach(desc => {
          if (desc.trim()) {
            latex.push(`        \\resumeItem{${escapeLatex(desc)}}`);
          }
        });
      }
      
      latex.push('      \\resumeItemListEnd');
      
      if (exp.technologies && exp.technologies.length > 0) {
        latex.push(`      \\resumeItem{\\textbf{Technologies:} ${exp.technologies.map(escapeLatex).join(', ')}}`);
      }
    });
    
    latex.push('  \\resumeSubHeadingListEnd');
    latex.push('');
  }

  // Projects
  if (resume.projects && resume.projects.length > 0) {
    latex.push('\\section{Projects}');
    latex.push('  \\resumeSubHeadingListStart');
    
    resume.projects.forEach(proj => {
      const projectHeader = proj.link 
        ? `\\resumeProjectHeading{\\textbf{${escapeLatex(proj.name)}}}{\\href{${proj.link}}{Link}}`
        : `\\resumeProjectHeading{\\textbf{${escapeLatex(proj.name)}}}{}`;
      
      latex.push(`    ${projectHeader}`);
      latex.push('      \\resumeItemListStart');
      
      if (proj.description) {
        latex.push(`        \\resumeItem{${escapeLatex(proj.description)}}`);
      }
      
      if (proj.highlights && proj.highlights.length > 0) {
        proj.highlights.forEach(highlight => {
          if (highlight.trim()) {
            latex.push(`        \\resumeItem{${escapeLatex(highlight)}}`);
          }
        });
      }
      
      if (proj.technologies && proj.technologies.length > 0) {
        latex.push(`        \\resumeItem{\\textbf{Technologies:} ${proj.technologies.map(escapeLatex).join(', ')}}`);
      }
      
      latex.push('      \\resumeItemListEnd');
    });
    
    latex.push('  \\resumeSubHeadingListEnd');
    latex.push('');
  }

  // Skills
  if (resume.skills && (resume.skills.technical?.length > 0 || resume.skills.frameworks?.length > 0 || resume.skills.tools?.length > 0)) {
    latex.push('\\section{Technical Skills}');
    latex.push(' \\begin{itemize}[leftmargin=0.15in, label={}]');
    latex.push('    \\small{\\item{');
    
    const skillSections = [];
    if (resume.skills.technical && resume.skills.technical.length > 0) {
      skillSections.push(`\\textbf{Languages}{: ${resume.skills.technical.map(escapeLatex).join(', ')}}`);
    }
    if (resume.skills.frameworks && resume.skills.frameworks.length > 0) {
      skillSections.push(`\\textbf{Frameworks}{: ${resume.skills.frameworks.map(escapeLatex).join(', ')}}`);
    }
    if (resume.skills.tools && resume.skills.tools.length > 0) {
      skillSections.push(`\\textbf{Tools}{: ${resume.skills.tools.map(escapeLatex).join(', ')}}`);
    }
    
    latex.push(`     ${skillSections.join(' \\\\\\\\ ')}`);
    latex.push('    }}');
    latex.push(' \\end{itemize}');
    latex.push('');
  }

  // Certifications
  if (resume.certifications && resume.certifications.length > 0) {
    latex.push('\\section{Certifications}');
    latex.push(' \\begin{itemize}[leftmargin=0.15in, label={}]');
    resume.certifications.forEach(cert => {
      latex.push(`    \\item \\textbf{${escapeLatex(cert.name)}} ${cert.issuer ? `- ${escapeLatex(cert.issuer)}` : ''} ${cert.date ? `(${cert.date})` : ''}`);
    });
    latex.push(' \\end{itemize}');
    latex.push('');
  }

  // Achievements
  if (resume.achievements && resume.achievements.length > 0) {
    latex.push('\\section{Achievements}');
    latex.push(' \\begin{itemize}[leftmargin=0.15in, label={}]');
    resume.achievements.forEach(achievement => {
      latex.push(`    \\item ${escapeLatex(achievement)}`);
    });
    latex.push(' \\end{itemize}');
    latex.push('');
  }

  latex.push('\\end{document}');

  return latex.join('\n');
};

// Helper function to escape special LaTeX characters
const escapeLatex = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
};

module.exports = {
  parseLatexToResume,
  convertResumeToLatex
};
