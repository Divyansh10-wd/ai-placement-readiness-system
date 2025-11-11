import { useState, useEffect, useRef } from 'react';
import { X, Download, Eye, EyeOff, Code, FileText, Maximize2, Minimize2, Copy, Check } from 'lucide-react';

export default function LatexEditorSplit({ resumeData, onClose, onSave, token }) {
  const [latexCode, setLatexCode] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const editorRef = useRef(null);

  // Generate LaTeX from resume data
  useEffect(() => {
    if (resumeData) {
      const latex = generateLatexFromResume(resumeData);
      setLatexCode(latex);
    }
  }, [resumeData]);

  const generateLatexFromResume = (data) => {
    const { personalInfo, experience, education, projects, skills, certifications, achievements } = data;

    return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${personalInfo?.fullName || 'Your Name'}} \\\\ \\vspace{1pt}
    \\small ${personalInfo?.phone || '123-456-7890'} $|$ \\href{mailto:${personalInfo?.email || 'email@example.com'}}{\\underline{${personalInfo?.email || 'email@example.com'}}} $|$ 
    ${personalInfo?.linkedin ? `\\href{${personalInfo.linkedin}}{\\underline{LinkedIn}} $|$` : ''}
    ${personalInfo?.github ? `\\href{${personalInfo.github}}{\\underline{GitHub}}` : ''}
\\end{center}

${personalInfo?.summary ? `
%-----------SUMMARY-----------
\\section{Professional Summary}
${personalInfo.summary}
` : ''}

${education && education.length > 0 ? `
%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
${education.map(edu => `    \\resumeSubheading
      {${edu.institution || 'University Name'}}{${edu.location || 'Location'}}
      {${edu.degree || 'Degree'} in ${edu.field || 'Field'}}{${edu.startDate || 'Start'} -- ${edu.endDate || 'End'}}
      ${edu.gpa ? `\\resumeItem{GPA: ${edu.gpa}}` : ''}
      ${edu.achievements ? `\\resumeItem{${edu.achievements}}` : ''}`).join('\n')}
  \\resumeSubHeadingListEnd
` : ''}

${experience && experience.length > 0 ? `
%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
${experience.map(exp => `
    \\resumeSubheading
      {${exp.company || 'Company Name'}}{${exp.location || 'Location'}}
      {${exp.position || 'Position'}}{${exp.startDate || 'Start'} -- ${exp.endDate || exp.current ? 'Present' : 'End'}}
      \\resumeItemListStart
${exp.responsibilities?.map(resp => `        \\resumeItem{${resp}}`).join('\n') || '        \\resumeItem{Responsibility description}'}
      \\resumeItemListEnd`).join('\n')}
  \\resumeSubHeadingListEnd
` : ''}

${projects && projects.length > 0 ? `
%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart
${projects.map(proj => `      \\resumeProjectHeading
          {\\textbf{${proj.name || 'Project Name'}} $|$ \\emph{${proj.technologies?.join(', ') || 'Technologies'}}}{${proj.link || ''}}
          \\resumeItemListStart
${proj.description ? `            \\resumeItem{${proj.description}}` : ''}
${proj.achievements?.map(ach => `            \\resumeItem{${ach}}`).join('\n') || ''}
          \\resumeItemListEnd`).join('\n')}
    \\resumeSubHeadingListEnd
` : ''}

${skills && (skills.technical?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) ? `
%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
${skills.technical?.length > 0 ? `     \\textbf{Languages}{: ${skills.technical.join(', ')}} \\\\` : ''}
${skills.frameworks?.length > 0 ? `     \\textbf{Frameworks}{: ${skills.frameworks.join(', ')}} \\\\` : ''}
${skills.tools?.length > 0 ? `     \\textbf{Tools}{: ${skills.tools.join(', ')}}` : ''}
    }}
 \\end{itemize}
` : ''}

${certifications && certifications.length > 0 ? `
%-----------CERTIFICATIONS-----------
\\section{Certifications}
 \\resumeSubHeadingListStart
${certifications.map(cert => `   \\resumeItem{\\textbf{${cert.name || 'Certification'}} -- ${cert.issuer || 'Issuer'} (${cert.date || 'Date'})}`).join('\n')}
 \\resumeSubHeadingListEnd
` : ''}

${achievements && achievements.length > 0 ? `
%-----------ACHIEVEMENTS-----------
\\section{Achievements}
 \\resumeSubHeadingListStart
${achievements.map(ach => `   \\resumeItem{${ach.description || ach}}`).join('\n')}
 \\resumeSubHeadingListEnd
` : ''}

\\end{document}`;
  };

  const handleDownload = () => {
    const blob = new Blob([latexCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resumeData?.title || 'resume'}.tex`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(latexCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompile = async () => {
    // This would typically call a LaTeX compilation service
    // For now, we'll just show the preview
    alert('LaTeX compilation would happen here. You can download the .tex file and compile it locally with pdflatex or use Overleaf.');
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white shadow-2xl flex flex-col ${isFullscreen ? 'w-full h-full' : 'rounded-2xl max-w-[95vw] w-full max-h-[95vh]'}`}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">LaTeX Editor</h2>
              <p className="text-sm text-gray-600">Edit and preview your resume in LaTeX</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Font Size Controls */}
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={() => setFontSize(Math.max(10, fontSize - 2))}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                A-
              </button>
              <span className="text-sm text-gray-600">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                A+
              </button>
            </div>

            {/* Toggle Preview */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={showPreview ? 'Hide Preview' : 'Show Preview'}
            >
              {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download .tex</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Editor and Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* LaTeX Code Editor */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} border-r border-gray-200 flex flex-col`}>
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">LaTeX Source</span>
              <span className="text-xs text-gray-500">{latexCode.split('\n').length} lines</span>
            </div>
            <div className="flex-1 overflow-auto">
              <textarea
                ref={editorRef}
                value={latexCode}
                onChange={(e) => setLatexCode(e.target.value)}
                className="w-full h-full px-4 py-3 font-mono resize-none focus:outline-none"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 flex flex-col bg-gray-50">
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Preview</span>
                <button
                  onClick={handleCompile}
                  className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Compile PDF
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
                  {/* Simple preview rendering */}
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: renderLatexPreview(latexCode) }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              💡 <strong>Tip:</strong> Download the .tex file and compile it with <code className="px-1 py-0.5 bg-gray-200 rounded">pdflatex</code> or use <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Overleaf</a>
            </div>
            <div>
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+S</kbd> to save
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple LaTeX to HTML converter for preview (basic implementation)
function renderLatexPreview(latex) {
  let html = latex;

  // Extract content between \begin{document} and \end{document}
  const docMatch = html.match(/\\begin{document}([\s\S]*)\\end{document}/);
  if (docMatch) {
    html = docMatch[1];
  }

  // Convert LaTeX commands to HTML
  html = html
    // Headers
    .replace(/\\textbf{\\Huge\\s+\\scshape\s+([^}]+)}/g, '<h1 class="text-4xl font-bold text-center mb-2">$1</h1>')
    .replace(/\\section{([^}]+)}/g, '<h2 class="text-2xl font-bold mt-6 mb-3 pb-2 border-b-2 border-gray-300">$1</h2>')
    
    // Text formatting
    .replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>')
    .replace(/\\textit{([^}]+)}/g, '<em>$1</em>')
    .replace(/\\emph{([^}]+)}/g, '<em>$1</em>')
    .replace(/\\underline{([^}]+)}/g, '<u>$1</u>')
    .replace(/\\scshape/g, '')
    
    // Links
    .replace(/\\href{([^}]+)}{([^}]+)}/g, '<a href="$1" class="text-blue-600 hover:underline">$2</a>')
    
    // Lists
    .replace(/\\resumeItemListStart/g, '<ul class="list-disc ml-6 my-2">')
    .replace(/\\resumeItemListEnd/g, '</ul>')
    .replace(/\\resumeItem{([^}]+)}/g, '<li class="mb-1">$1</li>')
    
    // Spacing
    .replace(/\\vspace{[^}]+}/g, '<div class="my-2"></div>')
    .replace(/\\\\/g, '<br/>')
    
    // Clean up LaTeX commands
    .replace(/\\small/g, '')
    .replace(/\\begin{center}/g, '<div class="text-center">')
    .replace(/\\end{center}/g, '</div>')
    .replace(/\\begin{itemize}[^]]*]/g, '<ul class="list-disc ml-6">')
    .replace(/\\end{itemize}/g, '</ul>')
    .replace(/\\item/g, '<li>')
    
    // Remove remaining LaTeX commands
    .replace(/\\[a-zA-Z]+(\[[^\]]*\])?({[^}]*})?/g, '')
    .replace(/\$\|?\$/g, ' | ')
    .replace(/[{}]/g, '');

  return html;
}
