# AI Resume Maker - User Guide

## Quick Start

### Step 1: Access the Resume Maker
1. Open the application at http://localhost:5173
2. Login to your account (or signup if you don't have one)
3. Click **"Resume Maker"** in the navigation bar

### Step 2: Create Your First Resume
1. Click the **"Create New Resume"** button
2. You'll be taken to the Resume Builder page

### Step 3: Fill in Your Information

#### Basic Information
- **Resume Title:** Give your resume a name (e.g., "Software Engineer Resume")
- **Template:** Choose from Modern, Classic, Minimal, or Professional

#### Personal Information
- Full Name *
- Email *
- Phone
- Location
- LinkedIn URL
- GitHub URL
- Portfolio URL
- Professional Summary (2-3 sentences about yourself)

#### Experience Section
1. Click **"Add Experience"** to add a job
2. Fill in:
   - Company name *
   - Position/Title *
   - Start Date
   - End Date (or check "Currently working here")
   - Description (one bullet point per line)
   - Technologies used

3. Click **"Add Experience"** again for more jobs
4. Use the trash icon to remove entries

#### Education Section
1. Click **"Add Education"**
2. Fill in:
   - Institution name *
   - Degree *
   - Field of study
   - GPA
   - Start/End dates
   - Achievements

#### Projects Section
1. Click **"Add Project"**
2. Fill in:
   - Project name *
   - Description
   - Technologies (comma separated)
   - Project link
   - GitHub link
   - Highlights

#### Skills Section
- **Technical Skills:** JavaScript, Python, Java (comma separated)
- **Frameworks:** React, Node.js, Express (comma separated)
- **Tools:** Git, Docker, AWS (comma separated)

### Step 4: Save Your Resume
- Click the **"Save"** button in the top right
- Your resume will be saved to your account

### Step 5: Get AI Analysis (Optional)
**Note:** Requires OpenAI API key to be configured

1. After saving, click **"AI Analyze"** button
2. Wait a few seconds for the analysis
3. View your scores:
   - **Overall Score:** How good your resume is (0-100)
   - **ATS Score:** How well it works with applicant tracking systems (0-100)
4. Read the improvement suggestions

### Step 6: Manage Your Resumes
Go back to the Resume List page to:
- **Edit:** Click the "Edit" button on any resume
- **Duplicate:** Click the copy icon to create a copy
- **Delete:** Click the trash icon to remove a resume

## Tips for Best Results

### Writing Experience Descriptions
✅ **Good:**
- "Developed a React application that increased user engagement by 40%"
- "Led a team of 5 engineers to deliver project 2 weeks ahead of schedule"
- "Optimized database queries reducing load time by 60%"

❌ **Avoid:**
- "Worked on various projects"
- "Responsible for coding"
- "Helped the team"

### Professional Summary
✅ **Good:**
"Full-stack developer with 3+ years of experience building scalable web applications. Specialized in React, Node.js, and AWS. Passionate about creating user-friendly interfaces and optimizing performance."

❌ **Avoid:**
"I am a developer looking for a job. I know many programming languages."

### Skills Section
- List specific technologies, not generic terms
- Include proficiency levels if relevant
- Group related skills together
- Keep it relevant to your target role

## AI Features Explained

### AI Analysis
The AI analyzes your resume and provides:
1. **Improved Summary:** A better version of your professional summary
2. **Skills to Add:** Technologies you should highlight based on your experience
3. **Experience Improvements:** Specific suggestions for each job entry
4. **Overall Score:** General quality assessment
5. **ATS Score:** How well your resume will perform with automated systems
6. **Top Improvements:** Actionable steps to enhance your resume

### Content Generation (Coming Soon)
- Generate professional summaries automatically
- Create compelling bullet points for experiences
- Write project descriptions that highlight impact

## Template Guide

### Modern Template
- **Best for:** Tech startups, creative roles
- **Features:** Contemporary design, accent colors
- **Industries:** Software, Design, Marketing

### Classic Template
- **Best for:** Traditional companies
- **Features:** Timeless layout, professional
- **Industries:** Finance, Consulting, Corporate

### Minimal Template
- **Best for:** Senior positions, academic roles
- **Features:** Clean, content-focused
- **Industries:** Research, Academia, Executive

### Professional Template
- **Best for:** Corporate environments
- **Features:** Formal, structured
- **Industries:** Banking, Legal, Government

## Keyboard Shortcuts
- **Ctrl/Cmd + S:** Save resume (when implemented)
- **Esc:** Close preview (when implemented)

## Common Questions

### Q: Can I have multiple resumes?
**A:** Yes! Create different versions for different job types.

### Q: How do I download my resume as PDF?
**A:** PDF export feature is coming soon. Currently, you can use browser print.

### Q: What if I don't have an OpenAI API key?
**A:** You can still create and edit resumes. AI features won't work without the key.

### Q: Can I share my resume with others?
**A:** Public sharing feature is planned for future release.

### Q: How is my data stored?
**A:** All resume data is securely stored in MongoDB and associated with your account.

## Troubleshooting

### Resume won't save
- Check that you filled in required fields (marked with *)
- Ensure you're logged in
- Check browser console for errors

### AI Analysis not working
- Verify OpenAI API key is configured in backend/.env
- Check that you saved the resume first
- Ensure you have internet connection

### Can't see my resumes
- Make sure you're logged in
- Refresh the page
- Check if backend server is running

## Best Practices

1. **Keep it concise:** 1-2 pages maximum
2. **Use action verbs:** Led, Developed, Implemented, Optimized
3. **Quantify achievements:** Use numbers and percentages
4. **Tailor for each job:** Create different versions for different roles
5. **Proofread:** Check for typos and grammar
6. **Update regularly:** Keep your resume current
7. **Get feedback:** Use AI analysis to improve

## Support
For issues or questions:
- Check the console logs in browser DevTools
- Verify backend server is running on port 5000
- Verify frontend server is running on port 5173
- Check MongoDB connection
