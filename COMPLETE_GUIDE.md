# 🎓 AI Placement Readiness System - Complete Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Features Overview](#features-overview)
3. [Resume Builder](#resume-builder)
4. [AI Mock Interviews](#ai-mock-interviews)
5. [Coding Problems](#coding-problems)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v16+)
- MongoDB
- API Keys: Groq, Judge0, ElevenLabs (optional)

### **Installation**

```bash
# Clone repository
git clone https://github.com/Divyansh10-wd/ai-placement-readiness-system.git
cd ai-placement-readiness-system

# Backend setup
cd backend
npm install
cp .env.example .env  # Add your API keys
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### **Environment Variables**

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com/submissions
JUDGE0_API_KEY=your_judge0_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key  # Optional for voice
```

### **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🎯 Features Overview

### **1. Resume Builder**
- 15+ professional templates
- LaTeX import/export
- AI-powered analysis and suggestions
- PDF export
- Real-time preview

### **2. AI Mock Interviews**
- Multiple interview types (Frontend, Backend, DevOps, ML/AI, etc.)
- Voice-to-voice interviews (optional)
- Real-time feedback
- Performance tracking
- Question bank with 100+ questions

### **3. Coding Problems Platform**
- Create and solve coding problems
- Multiple language support (C, C++, Java, Python)
- Test case validation
- Judge0 integration for code execution
- Problem difficulty levels

### **4. Dashboard & Analytics**
- Interview history
- Performance metrics
- Resume management
- Progress tracking

---

## 📄 Resume Builder

### **Creating a Resume**

1. **Navigate to Resume Maker**
2. **Choose a template** (15 options available)
3. **Fill in your details:**
   - Personal Information
   - Education
   - Experience
   - Skills
   - Projects
   - Certifications

4. **Preview in real-time**
5. **Export as PDF**

### **Available Templates**

**Professional:**
- Modern Professional
- Classic Professional
- Executive
- Corporate

**Technical:**
- Tech Minimalist
- Developer
- Software Engineer

**Creative:**
- Creative Modern
- Colorful
- Gradient

**Academic:**
- Academic
- Research

**Specialized:**
- Startup
- Consulting
- Sales & Marketing

### **LaTeX Import/Export**

**Import LaTeX:**
```latex
\documentclass{article}
\begin{document}
\section{Education}
\textbf{University Name} \\
Degree, Year
\end{document}
```

**Export to LaTeX:**
- Click "Export LaTeX" button
- Get formatted LaTeX code
- Use in Overleaf or local LaTeX editor

### **AI Analysis**

The AI analyzes your resume for:
- ✅ Content quality
- ✅ Formatting consistency
- ✅ Keyword optimization
- ✅ ATS compatibility
- ✅ Grammar and spelling
- ✅ Section completeness

**Suggestions include:**
- Missing sections
- Weak action verbs
- Quantification opportunities
- Formatting improvements

---

## 🎤 AI Mock Interviews

### **Interview Types**

1. **Frontend** - React, Vue, Angular, HTML/CSS, JavaScript
2. **Backend** - Node.js, Python, Java, Databases, APIs
3. **DevOps** - CI/CD, Docker, Kubernetes, Cloud
4. **DBMS** - SQL, NoSQL, Database design
5. **Python** - Python-specific questions
6. **Java** - Java-specific questions
7. **C++** - C++-specific questions
8. **OOPs** - Object-oriented programming
9. **ML/AI** - Machine learning, AI concepts
10. **System Design** - Architecture, scalability
11. **Behavioral** - Soft skills, situational questions

### **Difficulty Levels**
- **Easy** - Entry-level questions
- **Medium** - Mid-level questions
- **Hard** - Senior-level questions

### **Starting an Interview**

1. **Select interview type**
2. **Choose difficulty level**
3. **Click "Start Interview"**
4. **Answer 10 questions**
5. **Get instant feedback**
6. **Review overall performance**

### **Voice Interviews (Optional)**

**Requirements:**
- ElevenLabs API key
- Browser with speech recognition support (Chrome recommended)

**Features:**
- Text-to-speech for questions
- Speech-to-text for answers
- Natural conversation flow
- Voice feedback

**Browser Speech Recognition:**
- Free alternative to Whisper API
- Works in Chrome, Edge, Safari
- No API key required
- Real-time transcription

---

## 💻 Coding Problems

### **Viewing Problems**

1. Navigate to **Problems** page
2. Browse available problems
3. Filter by difficulty, tags, or search
4. Click **Solve** to start

### **Solving Problems**

1. **Read problem statement**
2. **Check sample test cases**
3. **Select programming language**
4. **Write your code**
5. **Run Code** - Test with custom input
6. **Submit** - Run against all test cases

### **Creating Problems**

1. Navigate to **Create Problem**
2. **Fill in details:**
   - Title
   - Description
   - Input/Output format
   - Constraints
   - Difficulty level
3. **Add sample test cases** (visible to users)
4. **Add hidden test cases** (for evaluation)
5. **Set time and memory limits**
6. **Publish**

### **Supported Languages**

- **C** (GCC 9.2.0)
- **C++** (G++ 9.2.0)
- **Java** (OpenJDK 13.0.1)
- **Python 3** (3.8.1)

---

## 🔌 API Reference

### **Authentication**

**Register:**
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login:**
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### **Resumes**

**Get all resumes:**
```bash
GET /api/resumes
Authorization: Bearer <token>
```

**Create resume:**
```bash
POST /api/resumes
Authorization: Bearer <token>
{
  "personalInfo": {...},
  "education": [...],
  "experience": [...],
  "skills": [...],
  "template": "modern"
}
```

**Analyze resume:**
```bash
POST /api/resumes/:id/analyze
Authorization: Bearer <token>
```

### **Interviews**

**Start interview:**
```bash
POST /api/interviews/start
Authorization: Bearer <token>
{
  "type": "frontend",
  "difficulty": "medium"
}
```

**Submit answer:**
```bash
POST /api/interviews/answer
Authorization: Bearer <token>
{
  "interviewId": "...",
  "question": "...",
  "answer": "..."
}
```

### **Problems**

**Get all problems:**
```bash
GET /api/problems
GET /api/problems/all  # Array format
```

**Get problem by ID:**
```bash
GET /api/problems/:id
```

**Create problem:**
```bash
POST /api/problems
Authorization: Bearer <token>
{
  "title": "Two Sum",
  "description": "...",
  "sampleTestCases": [...],
  "hiddenTestCases": [...],
  "difficulty": "Easy"
}
```

**Submit code:**
```bash
POST /api/submissions
{
  "sourceCode": "...",
  "languageId": 71,
  "stdin": "..."
}
```

---

## 🔧 Troubleshooting

### **Common Issues**

#### **1. "Invalid token" error**
**Solution:** Log in again or clear browser cache
```javascript
localStorage.clear();
location.reload();
```

#### **2. Problem statement not showing**
**Solution:** Hard refresh browser (Ctrl+Shift+R)

#### **3. Code execution fails**
**Causes:**
- Judge0 API key invalid
- Rate limit exceeded
- Syntax errors in code

**Solution:** Check API key and code syntax

#### **4. Voice features not working**
**Causes:**
- ElevenLabs API key missing
- Browser doesn't support speech recognition
- Microphone permissions denied

**Solution:**
- Add ElevenLabs API key
- Use Chrome/Edge browser
- Allow microphone access

#### **5. Resume export fails**
**Solution:** Check if all required fields are filled

#### **6. MongoDB connection error**
**Solution:** Verify MONGO_URI in .env file

### **Backend Not Starting**

```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process if needed
kill -9 <PID>

# Restart backend
cd backend
npm start
```

### **Frontend Not Starting**

```bash
# Check if port 5173 is in use
lsof -i :5173

# Kill process if needed
kill -9 <PID>

# Restart frontend
cd frontend
npm run dev
```

### **Database Issues**

```bash
# Test MongoDB connection
mongosh "your_connection_string"

# Check if collections exist
show collections
```

---

## 📊 Tech Stack

### **Frontend**
- React 18
- Vite
- TailwindCSS
- Monaco Editor
- Lucide Icons
- Axios

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Groq API (AI)
- Judge0 API (Code execution)
- ElevenLabs API (Voice)

### **AI Models**
- **Chat:** llama-3.3-70b-versatile (Groq)
- **Speech:** whisper-large-v3 (Groq)
- **TTS:** ElevenLabs Multilingual v2

---

## 🎓 Best Practices

### **For Resumes**
- Use action verbs
- Quantify achievements
- Keep it concise (1-2 pages)
- Tailor to job description
- Proofread carefully

### **For Interviews**
- Practice regularly
- Answer in detail (20+ characters)
- Use STAR method for behavioral questions
- Think before answering
- Review feedback

### **For Coding Problems**
- Read problem carefully
- Test with sample cases first
- Consider edge cases
- Optimize for time/space complexity
- Comment your code

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📧 Support

For issues or questions:
- GitHub Issues: [Create an issue](https://github.com/Divyansh10-wd/ai-placement-readiness-system/issues)
- Email: support@example.com

---

**Last Updated:** October 25, 2025  
**Version:** 2.0  
**Status:** ✅ Production Ready
