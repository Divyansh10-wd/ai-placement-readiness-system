# LaTeX Import/Export - Quick Start Guide

## 🚀 Quick Overview

The resume system now supports **LaTeX import and export**, allowing you to:
- Import existing LaTeX resumes
- Export resumes as LaTeX code
- Use both web and LaTeX workflows

---

## 📥 Import from LaTeX (3 Steps)

### Step 1: Open Import Modal
- Go to **"My Resumes"** page
- Click **"Import from LaTeX"** (green button)

### Step 2: Paste Your LaTeX Code
- Paste your LaTeX resume code
- OR click **"Load Sample Template"** to see an example
- Click **"Preview"** to verify parsing

### Step 3: Import
- Review the preview data
- Click **"Import Resume"**
- You'll be redirected to Resume Builder

---

## 📤 Export to LaTeX (3 Steps)

### Step 1: Open Resume
- Open any resume in Resume Builder
- Ensure it's saved (must have an ID)

### Step 2: Export
- Click **"LaTeX"** button (green, in header)
- Click **"Export to LaTeX"**
- Review the generated code

### Step 3: Download
- Click **"Download .tex File"**
- Open in LaTeX editor (Overleaf, TeXShop, etc.)
- Compile with `pdflatex`

---

## 📋 Sample LaTeX Template

```latex
\documentclass[letterpaper,11pt]{article}

\begin{document}

\begin{center}
    \textbf{\Huge \scshape Your Name} \\ \vspace{1pt}
    \small 123-456-7890 $|$ \href{mailto:you@email.com}{you@email.com}
\end{center}

\section{Summary}
Your professional summary here.

\section{Experience}
  \resumeSubheading
    {Company Name}{City, State}
    {Job Title}{Jan 2020 -- Present}
    \resumeItemListStart
      \resumeItem{Achievement or responsibility}
      \resumeItem{Another achievement}
    \resumeItemListEnd

\section{Education}
  \resumeSubheading
    {University Name}{City, State}
    {Degree Name}{Aug 2015 -- May 2019}

\section{Technical Skills}
 \begin{itemize}
    \small{\item{
     \textbf{Languages}{: JavaScript, Python, Java} \\
     \textbf{Frameworks}{: React, Node.js, Django}
    }}
 \end{itemize}

\end{document}
```

---

## ✅ What Gets Imported

- ✅ Name, Email, Phone, Location
- ✅ LinkedIn, GitHub, Portfolio links
- ✅ Professional Summary
- ✅ Work Experience (with descriptions)
- ✅ Education (with achievements)
- ✅ Projects (with technologies)
- ✅ Skills (categorized)
- ✅ Certifications
- ✅ Achievements

---

## 🎯 Common Use Cases

### Use Case 1: Migrate from LaTeX
1. Have existing LaTeX resume
2. Import into system
3. Use AI analysis features
4. Choose from 15 templates

### Use Case 2: Maintain Both Versions
1. Build in web interface
2. Export to LaTeX for submissions
3. Keep both versions synced

### Use Case 3: Academic Submissions
1. Create resume online
2. Export to LaTeX
3. Submit to academic institutions

---

## 🔧 Buttons Location

### Import Button
- **Location**: Resumes list page, top-right header
- **Color**: Green
- **Icon**: FileCode
- **Text**: "Import from LaTeX"

### Export Button
- **Location**: Resume Builder, top-right header
- **Color**: Green
- **Icon**: FileCode
- **Text**: "LaTeX"
- **Note**: Only enabled for saved resumes

---

## ⚠️ Important Notes

1. **Preview Before Import**: Always preview to verify data extraction
2. **Save After Import**: Imported resumes are automatically saved
3. **Export Requires Save**: Must save resume before exporting
4. **Standard Formats**: Works best with standard LaTeX resume formats
5. **Manual Review**: Check imported data for accuracy

---

## 🐛 Troubleshooting

### Import Not Working?
- Check LaTeX syntax is valid
- Use standard resume commands
- Try the sample template first

### Export Not Working?
- Ensure resume is saved
- Check you're logged in
- Try refreshing the page

### Data Missing After Import?
- Some LaTeX commands may not be recognized
- Manually add missing data in Resume Builder
- Use preview to check before importing

---

## 📚 Supported LaTeX Commands

**Personal Info:**
- `\name{}`, `\email{}`, `\phone{}`
- `\address{}`, `\location{}`

**Sections:**
- `\section{Experience}`, `\section{Education}`
- `\section{Projects}`, `\section{Skills}`

**Entries:**
- `\resumeSubheading{}{}{}{}`
- `\cventry{}{}{}{}{}{}`
- `\resumeItem{}`

**Formatting:**
- `\textbf{}` (bold)
- `\href{}{}` (links)

---

## 🎉 Benefits

✅ **Flexibility**: Use web or LaTeX, your choice  
✅ **AI Features**: Get AI suggestions on imported resumes  
✅ **Templates**: Choose from 15 professional templates  
✅ **Portability**: Export and use anywhere  
✅ **No Lock-in**: Always have LaTeX version  

---

## 📖 Need More Help?

See the full documentation: `LATEX_FEATURE_DOCUMENTATION.md`

---

**Happy Resume Building! 🚀**
