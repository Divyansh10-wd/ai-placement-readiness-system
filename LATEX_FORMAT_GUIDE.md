# LaTeX Format Guide for Import

## ✅ Supported LaTeX Format

The parser works best with the **Jake's Resume Template** format, which uses custom commands like `\resumeSubheading` and `\resumeItem`.

---

## 📋 Working Example

Here's a complete example that will parse correctly:

```latex
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[hidelinks]{hyperref}

\begin{document}

% HEADER - Name and Contact
\begin{center}
    \textbf{\Huge \scshape John Doe} \\ \vspace{1pt}
    \small 123-456-7890 $|$ \href{mailto:john@example.com}{john@example.com} $|$ 
    \href{https://linkedin.com/in/johndoe}{LinkedIn} $|$
    \href{https://github.com/johndoe}{GitHub}
\end{center}

% SUMMARY
\section{Summary}
Experienced software engineer with 5+ years in full-stack development.

% EDUCATION
\section{Education}
  \resumeSubheading
    {University Name}{City, State}
    {Bachelor of Science in Computer Science}{Aug 2015 -- May 2019}

% EXPERIENCE
\section{Experience}
  \resumeSubheading
    {Company Name}{City, State}
    {Job Title}{Jan 2020 -- Present}
    \resumeItem{Achievement or responsibility here}
    \resumeItem{Another achievement with metrics}
    \resumeItem{Third accomplishment}

  \resumeSubheading
    {Previous Company}{City, State}
    {Previous Job Title}{Jun 2019 -- Dec 2019}
    \resumeItem{What you did at this job}
    \resumeItem{Another responsibility}

% PROJECTS
\section{Projects}
  \resumeProjectHeading
    {\textbf{Project Name}}{https://github.com/username/project}
    \resumeItem{Project description and what you built}
    \resumeItem{Technologies: React, Node.js, MongoDB}

% SKILLS
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: JavaScript, Python, Java, C++} \\
     \textbf{Frameworks}{: React, Node.js, Express, Django} \\
     \textbf{Tools}{: Git, Docker, AWS, MongoDB}
    }}
 \end{itemize}

\end{document}
```

---

## 🎯 Key Commands That Work

### Personal Information
```latex
% Name (in center environment)
\textbf{\Huge \scshape Your Name}

% Contact info
123-456-7890
\href{mailto:you@email.com}{you@email.com}
\href{https://linkedin.com/in/username}{LinkedIn}
\href{https://github.com/username}{GitHub}
```

### Sections
```latex
\section{Summary}
Your professional summary text here.

\section{Education}
\section{Experience}
\section{Projects}
\section{Technical Skills}
```

### Education Entry
```latex
\resumeSubheading
  {University Name}{City, State}
  {Degree Name}{Start Date -- End Date}
```

### Experience Entry
```latex
\resumeSubheading
  {Company Name}{City, State}
  {Job Title}{Start Date -- Present}
  \resumeItem{First achievement or responsibility}
  \resumeItem{Second achievement with numbers}
  \resumeItem{Third accomplishment}
```

### Project Entry
```latex
\resumeProjectHeading
  {\textbf{Project Name}}{https://project-link.com}
  \resumeItem{Project description}
  \resumeItem{Technologies used}
```

### Skills
```latex
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: JavaScript, Python, Java} \\
     \textbf{Frameworks}{: React, Node.js, Django} \\
     \textbf{Tools}{: Git, Docker, AWS}
    }}
 \end{itemize}
```

---

## ✅ What Gets Extracted

### From Header
- ✅ **Name**: From `\textbf{\Huge \scshape Name}`
- ✅ **Email**: From email address or `\href{mailto:...}`
- ✅ **Phone**: Phone number pattern (123-456-7890)
- ✅ **LinkedIn**: From linkedin.com URL
- ✅ **GitHub**: From github.com URL

### From Sections
- ✅ **Summary**: Text after `\section{Summary}`
- ✅ **Education**: All `\resumeSubheading` entries
- ✅ **Experience**: All `\resumeSubheading` entries with `\resumeItem` descriptions
- ✅ **Projects**: All `\resumeProjectHeading` entries
- ✅ **Skills**: Categorized from `\textbf{Category}{: skills}`

---

## ⚠️ Important Notes

### DO Use These Patterns

✅ **Name in center environment**:
```latex
\begin{center}
    \textbf{\Huge \scshape Your Name}
\end{center}
```

✅ **resumeSubheading for Experience/Education**:
```latex
\resumeSubheading
  {Organization}{Location}
  {Title/Degree}{Dates}
```

✅ **resumeItem for bullet points**:
```latex
\resumeItem{Your achievement here}
```

✅ **Date format with double dash**:
```latex
Jan 2020 -- Present
Aug 2015 -- May 2019
```

### DON'T Use These

❌ **Custom commands not defined**:
```latex
\myCustomCommand{...}  % Won't work
```

❌ **Complex nested structures**:
```latex
\begin{tabular}...\end{tabular}  % May not parse correctly
```

❌ **Images or graphics**:
```latex
\includegraphics{...}  % Not supported
```

---

## 🔧 Troubleshooting

### Problem: Name not found
**Solution**: Use this exact format:
```latex
\textbf{\Huge \scshape Your Full Name}
```

### Problem: Email not found
**Solution**: Include email in one of these formats:
```latex
youremail@example.com
\href{mailto:youremail@example.com}{youremail@example.com}
```

### Problem: Experience entries = 0
**Solution**: Make sure you're using `\resumeSubheading` command:
```latex
\section{Experience}
  \resumeSubheading
    {Company}{Location}
    {Job Title}{Dates}
    \resumeItem{Description}
```

### Problem: Skills not found
**Solution**: Use this exact format:
```latex
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: JavaScript, Python, Java}
    }}
 \end{itemize}
```

---

## 📝 Step-by-Step Conversion

If your LaTeX resume doesn't match this format, here's how to convert it:

### 1. Convert Header
**From**:
```latex
\name{John Doe}
\email{john@example.com}
```

**To**:
```latex
\begin{center}
    \textbf{\Huge \scshape John Doe} \\ \vspace{1pt}
    \small \href{mailto:john@example.com}{john@example.com}
\end{center}
```

### 2. Convert Experience
**From**:
```latex
\cventry{2020--Present}{Software Engineer}{Company}{Location}{}
{Description here}
```

**To**:
```latex
\resumeSubheading
  {Company}{Location}
  {Software Engineer}{2020 -- Present}
  \resumeItem{Description here}
```

### 3. Convert Skills
**From**:
```latex
\cvitem{Languages}{JavaScript, Python}
\cvitem{Frameworks}{React, Django}
```

**To**:
```latex
\section{Technical Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Languages}{: JavaScript, Python} \\
     \textbf{Frameworks}{: React, Django}
    }}
 \end{itemize}
```

---

## 🎯 Quick Checklist

Before importing, verify your LaTeX has:

- [ ] Name in `\textbf{\Huge \scshape ...}` format
- [ ] Email address visible in the document
- [ ] `\section{Experience}` with `\resumeSubheading` entries
- [ ] `\section{Education}` with `\resumeSubheading` entries
- [ ] `\resumeItem{...}` for bullet points
- [ ] Skills in `\textbf{Category}{: items}` format
- [ ] Dates in `Start -- End` format
- [ ] No custom undefined commands

---

## 💡 Pro Tips

1. **Use the Sample Template**: Click "Load Sample Template" to see a working example
2. **Preview First**: Always click "Preview" before importing to verify parsing
3. **Check Preview Data**: Review what was extracted before importing
4. **Manual Edits**: After import, you can manually add any missing data
5. **Keep It Simple**: Simpler LaTeX structures parse better

---

## 🚀 Alternative: moderncv Format

If you're using moderncv, you can still import, but you may need to adjust some commands:

```latex
% moderncv commands that work:
\name{First}{Last}          % Will extract name
\email{email@example.com}   % Will extract email
\phone{123-456-7890}        % Will extract phone

\cventry{dates}{title}{company}{location}{}{description}  % Will parse
```

---

## 📚 Resources

- **Jake's Resume Template**: The format this parser is optimized for
- **Overleaf Templates**: Search for "Jake Resume" or "ATS Resume"
- **Sample Template**: Use the "Load Sample Template" button in the import modal

---

## ✅ Summary

**Best Format**: Jake's Resume style with `\resumeSubheading` and `\resumeItem`  
**Key Commands**: `\resumeSubheading`, `\resumeItem`, `\resumeProjectHeading`  
**Always**: Preview before importing to verify parsing  
**Remember**: You can manually edit after import if something is missing  

Happy importing! 🎉
