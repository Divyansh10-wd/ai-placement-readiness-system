# LaTeX Import/Export Feature Documentation

## Overview
The AI Placement Readiness System now supports **bidirectional LaTeX conversion**, allowing users to:
- **Import** existing LaTeX resumes into the system
- **Export** resumes as LaTeX code for use with LaTeX editors (Overleaf, TeXShop, etc.)

This feature bridges the gap between traditional LaTeX resume workflows and modern web-based resume builders.

---

## Features

### ✅ Import from LaTeX
- Paste LaTeX resume code
- Preview parsed data before importing
- Automatic extraction of:
  - Personal information (name, email, phone, location)
  - Contact links (LinkedIn, GitHub, Portfolio)
  - Professional summary
  - Work experience with descriptions
  - Education history
  - Projects with technologies
  - Skills (categorized)
  - Certifications
  - Achievements

### ✅ Export to LaTeX
- Convert any resume to LaTeX format
- Download as `.tex` file
- Compatible with standard LaTeX editors
- Professional formatting with custom commands
- Ready to compile with pdflatex

### ✅ Supported LaTeX Formats
- **moderncv** style resumes
- **article** class with custom commands
- **resumeSubheading** format
- **cventry** format
- Standard academic CV formats

---

## How to Use

### Importing from LaTeX

#### From Resumes Page:
1. Click **"Import from LaTeX"** button (green button in header)
2. Paste your LaTeX code in the editor
3. (Optional) Click **"Load Sample Template"** to see an example
4. Click **"Preview"** to verify the data is parsed correctly
5. Review the preview data showing extracted information
6. Click **"Import Resume"** to create the resume
7. You'll be redirected to the Resume Builder with your imported data

#### From Resume Builder:
1. Navigate to Resume Builder
2. Click **"LaTeX"** button in the header
3. The export modal will open (since you're editing an existing resume)

### Exporting to LaTeX

1. Open any resume in Resume Builder
2. Click the **"LaTeX"** button (green button in header)
3. Click **"Export to LaTeX"** button
4. Review the generated LaTeX code
5. Click **"Download .tex File"** to save
6. Open the file in your favorite LaTeX editor
7. Compile with `pdflatex` or upload to Overleaf

---

## Technical Implementation

### Backend Components

#### 1. LaTeX Parser (`/backend/utils/latexConverter.js`)
**Function**: `parseLatexToResume(latexCode)`

Extracts data from LaTeX code and converts to resume JSON format.

**Supports**:
- `\name{}`, `\email{}`, `\phone{}`, `\address{}` commands
- `\section{Experience}`, `\section{Education}`, etc.
- `\cventry{}{}{}{}{}{}` format
- `\resumeSubheading{}{}{}{}` format
- `\resumeItem{}` for bullet points
- `\textbf{}` for bold text and skill categories
- `\href{}{}` for links

**Returns**: Resume object matching the Resume model schema

#### 2. LaTeX Generator (`/backend/utils/latexConverter.js`)
**Function**: `convertResumeToLatex(resume)`

Converts resume JSON to professional LaTeX code.

**Generates**:
- Complete LaTeX document with all necessary packages
- Custom commands for consistent formatting
- Properly escaped special characters
- Structured sections with proper spacing
- Hyperlinks for contact information

**Returns**: Complete LaTeX code as string

#### 3. API Endpoints

**POST `/api/resumes/import-latex`**
- Imports LaTeX code and creates new resume
- Requires: `{ latexCode: string }`
- Returns: Created resume object

**POST `/api/resumes/preview-latex`**
- Previews LaTeX parsing without saving
- Requires: `{ latexCode: string }`
- Returns: Parsed resume data for preview

**GET `/api/resumes/:id/export-latex`**
- Exports existing resume to LaTeX
- Returns: `{ latexCode: string }`

### Frontend Components

#### 1. LaTeX Editor Component (`/frontend/src/components/LatexEditor.jsx`)

**Props**:
- `mode`: 'import' or 'export'
- `resumeId`: ID of resume (for export)
- `token`: Authentication token
- `onClose`: Callback when modal closes
- `onImport`: Callback when import succeeds

**Features**:
- Code editor with syntax highlighting (monospace font)
- Sample template loader
- Preview functionality
- Error/success alerts
- Download functionality
- Responsive design

#### 2. Integration Points

**Resume Builder** (`/frontend/src/pages/ResumeBuilder.jsx`):
- LaTeX button in header (green)
- Opens export modal for existing resumes
- Disabled until resume is saved

**Resumes List** (`/frontend/src/pages/Resumes.jsx`):
- "Import from LaTeX" button in header
- Opens import modal
- Redirects to builder after successful import

---

## LaTeX Format Examples

### Sample Input (Import)

```latex
\documentclass[letterpaper,11pt]{article}

\begin{document}

\begin{center}
    \textbf{\Huge \scshape John Doe} \\ \vspace{1pt}
    \small 123-456-7890 $|$ \href{mailto:john@example.com}{john@example.com} $|$ 
    \href{https://linkedin.com/in/johndoe}{LinkedIn}
\end{center}

\section{Summary}
Experienced software engineer with 5+ years in full-stack development.

\section{Experience}
  \resumeSubHeadingListStart
    \resumeSubheading
      {Tech Company}{San Francisco, CA}
      {Senior Software Engineer}{Jan 2020 -- Present}
      \resumeItemListStart
        \resumeItem{Developed scalable web applications}
        \resumeItem{Led team of 5 engineers}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

\section{Technical Skills}
 \begin{itemize}
    \small{\item{
     \textbf{Languages}{: JavaScript, Python, Java} \\
     \textbf{Frameworks}{: React, Node.js, Django}
    }}
 \end{itemize}

\end{document}
```

### Sample Output (Export)

The system generates a complete LaTeX document with:
- All necessary packages and formatting
- Custom commands for resume sections
- Properly formatted sections
- Escaped special characters
- Hyperlinked contact information

---

## Supported LaTeX Commands

### Personal Information
- `\name{Full Name}`
- `\email{email@example.com}`
- `\phone{123-456-7890}`
- `\mobile{123-456-7890}`
- `\address{City, State}`
- `\location{City, State}`
- `\linkedin{username}` or `linkedin.com/in/username`
- `\github{username}` or `github.com/username`

### Sections
- `\section{Experience}`
- `\section{Education}`
- `\section{Projects}`
- `\section{Skills}` or `\section{Technical Skills}`
- `\section{Certifications}`
- `\section{Achievements}`
- `\section{Summary}` or `\section{Objective}`

### Experience/Education Entries
- `\cventry{dates}{title}{organization}{location}{field}{description}`
- `\resumeSubheading{organization}{location}{title}{dates}`
- `\resumeItem{bullet point text}`
- `\resumeItemListStart` and `\resumeItemListEnd`

### Projects
- `\resumeProjectHeading{\textbf{Project Name}}{Link}`
- `\project{name}{link}`

### Skills
- `\textbf{Category}{: skill1, skill2, skill3}`

### Formatting
- `\textbf{bold text}`
- `\textit{italic text}`
- `\href{url}{text}`

---

## Error Handling

### Common Import Errors

**Error**: "Failed to parse LaTeX code"
- **Cause**: Invalid or unsupported LaTeX syntax
- **Solution**: Ensure your LaTeX follows standard resume formats

**Error**: "LaTeX code is required"
- **Cause**: Empty input
- **Solution**: Paste valid LaTeX code

**Error**: "Failed to import from LaTeX"
- **Cause**: Server error or authentication issue
- **Solution**: Check your connection and try again

### Common Export Errors

**Error**: "Resume not found"
- **Cause**: Invalid resume ID or unauthorized access
- **Solution**: Ensure you're exporting your own resume

**Error**: "Failed to export to LaTeX"
- **Cause**: Server error
- **Solution**: Try again or contact support

---

## Best Practices

### For Importing

1. **Use Standard Formats**: Stick to common LaTeX resume templates
2. **Preview First**: Always preview before importing to verify data extraction
3. **Check Extracted Data**: Review the preview to ensure all information was captured
4. **Manual Adjustments**: After import, review and adjust any missing or incorrect data
5. **Save Immediately**: Save the imported resume to preserve your work

### For Exporting

1. **Complete Your Resume**: Ensure all sections are filled before exporting
2. **Test Compilation**: After downloading, test compile in a LaTeX editor
3. **Customize Further**: Use the exported code as a base for further customization
4. **Keep Backups**: Save both the web version and LaTeX version

---

## Use Cases

### 1. Migrating from LaTeX to Web
**Scenario**: You have an existing LaTeX resume and want to use the AI features

**Steps**:
1. Copy your LaTeX code
2. Import into the system
3. Use AI analysis to improve content
4. Choose from 15 professional templates
5. Export back to LaTeX if needed

### 2. Using Both Platforms
**Scenario**: You want to maintain both web and LaTeX versions

**Workflow**:
1. Build resume in web interface
2. Export to LaTeX for academic submissions
3. Make updates in web version
4. Re-export to keep LaTeX version current

### 3. Collaboration
**Scenario**: Team members use different tools

**Solution**:
- Some team members use web interface
- Others prefer LaTeX
- Easy conversion between formats
- Share and collaborate seamlessly

### 4. Version Control
**Scenario**: You want to track changes in Git

**Workflow**:
1. Build resume in web interface
2. Export to LaTeX
3. Commit `.tex` file to Git
4. Track changes over time
5. Re-import if needed

---

## Limitations

### Current Limitations

1. **Parsing Accuracy**: Complex LaTeX formatting may not parse perfectly
2. **Custom Commands**: Very specialized custom commands may not be recognized
3. **Formatting**: Some visual formatting details may be lost in conversion
4. **Images**: Profile pictures and images are not supported
5. **Tables**: Complex table structures may not convert correctly

### Not Supported

- Multi-page resumes with page breaks
- Custom fonts and colors (exports use standard formatting)
- Graphics and images
- Complex mathematical notation
- Bibliography/publications (coming soon)

---

## Future Enhancements

### Planned Features

- [ ] Support for academic CV format with publications
- [ ] Custom LaTeX template selection
- [ ] Live LaTeX preview (rendered PDF)
- [ ] Batch import/export
- [ ] LaTeX syntax validation
- [ ] More granular parsing options
- [ ] Support for moderncv themes
- [ ] Bibliography integration
- [ ] Multi-language support

---

## Troubleshooting

### Import Issues

**Problem**: Some data not extracted
- **Solution**: Check if your LaTeX uses supported commands
- **Workaround**: Manually add missing data after import

**Problem**: Formatting looks different
- **Solution**: The web version uses its own styling
- **Note**: Content is preserved, styling may differ

### Export Issues

**Problem**: LaTeX won't compile
- **Solution**: Ensure you have all required packages installed
- **Try**: Upload to Overleaf which has all packages

**Problem**: Special characters appear incorrectly
- **Solution**: The system escapes special characters automatically
- **Note**: This is correct LaTeX behavior

---

## API Reference

### Import LaTeX
```javascript
POST /api/resumes/import-latex
Headers: { Authorization: 'Bearer <token>' }
Body: { latexCode: string }
Response: { success: boolean, resume: object, message: string }
```

### Preview LaTeX
```javascript
POST /api/resumes/preview-latex
Headers: { Authorization: 'Bearer <token>' }
Body: { latexCode: string }
Response: { success: boolean, resumeData: object, message: string }
```

### Export to LaTeX
```javascript
GET /api/resumes/:id/export-latex
Headers: { Authorization: 'Bearer <token>' }
Response: { success: boolean, latexCode: string, message: string }
```

---

## Files Modified/Created

### Backend
- **Created**: `/backend/utils/latexConverter.js` - LaTeX conversion utilities
- **Modified**: `/backend/controllers/resumeController.js` - Added LaTeX endpoints
- **Modified**: `/backend/routes/resumeRoutes.js` - Added LaTeX routes

### Frontend
- **Created**: `/frontend/src/components/LatexEditor.jsx` - LaTeX editor UI
- **Modified**: `/frontend/src/pages/ResumeBuilder.jsx` - Added LaTeX export
- **Modified**: `/frontend/src/pages/Resumes.jsx` - Added LaTeX import

### Documentation
- **Created**: `/LATEX_FEATURE_DOCUMENTATION.md` - This file

---

## Summary

The LaTeX import/export feature provides seamless integration between traditional LaTeX workflows and modern web-based resume building. Users can:

✅ Import existing LaTeX resumes  
✅ Export to LaTeX for academic/professional use  
✅ Maintain both web and LaTeX versions  
✅ Leverage AI features while keeping LaTeX compatibility  
✅ Collaborate across different platforms  

This feature makes the AI Placement Readiness System a comprehensive solution for all resume needs, whether you prefer web interfaces or LaTeX.
