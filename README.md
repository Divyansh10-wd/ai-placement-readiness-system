# 🎯 AI Placement Readiness System

A comprehensive AI-powered platform for technical interview preparation featuring:
- 💻 LeetCode-style coding problems with real-time execution
- 🤖 AI Mock Interviews with intelligent questioning and feedback
- 📄 AI Resume Analysis & Improvement using Groq AI
- 📊 Performance analytics and progress tracking

> Built with React, Node.js, MongoDB, and powered by Groq AI (Llama 3.3 70B) for intelligent features.

## ✨ Features

### 1. **LeetCode-Style Coding Platform**
- Real-time code execution with Judge0 API
- Multiple programming languages (C, C++, Java, Python)
- Problem creation and sharing
- Test case validation
- Detailed execution feedback

### 2. **AI Mock Interview System** 🆕
- AI-powered intelligent questioning
- Three interview types: Technical, Behavioral, System Design
- Three difficulty levels: Easy, Medium, Hard
- Real-time answer evaluation
- Instant feedback after each question
- Comprehensive performance reports
- Interview history tracking

### 3. **AI Resume Analysis & Improvement** 🆕
Powered by Groq AI (Llama 3.3 70B) for intelligent resume enhancement

**Resume Analysis:**
- **Overall Score** (0-100): Content quality, formatting, achievements
- **ATS Score** (0-100): Applicant Tracking System compatibility
- **Impact Score** (0-100): Achievement-oriented content rating
- **Top 5 Strengths**: What's working well in your resume
- **Top 5 Weaknesses**: Areas that need improvement
- **7 Actionable Recommendations**: Specific suggestions to enhance your resume

**AI Resume Improvement:**
- Automatically enhances resume content using AI
- Strengthens action verbs and descriptions
- Adds quantifiable achievements
- Optimizes for ATS with relevant keywords
- Improves professional summary
- Shows key changes made
- Download improved resume as text file

**Features:**
- Upload PDF/TXT files or paste text directly
- Instant AI-powered analysis (5-10 seconds)
- Real-time feedback and scoring
- Downloadable improved version

### 4. **User Management**
- JWT-based authentication
- User dashboard
- Problem publishing
- Interview history
- Resume management

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with Mongoose - Database
- **Groq API** (Llama 3.3 70B) - AI interviews & resume analysis
- **Judge0 API** - Code execution engine
- **ElevenLabs API** - Voice synthesis (optional)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **pdf-parse** - PDF resume parsing
- **multer** - File upload handling

### Frontend
- **React 18** with **Vite** - Fast development
- **Tailwind CSS** - Utility-first styling
- **Monaco Editor** - VS Code-like code editor
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Modern icon library

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Groq API Key (for AI interviews & resume analysis)
- Judge0 API Key (for code execution)
- ElevenLabs API Key (optional, for voice)

### Quick Start

```bash
# Clone repository
git clone https://github.com/Divyansh10-wd/ai-placement-readiness-system.git
cd ai-placement-readiness-system

# Backend setup
cd backend
npm install
cp .env.example .env  # Configure your API keys (see below)
npm run dev  # Development with auto-reload

# Frontend setup (open new terminal)
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

**🌐 Access the application:**
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **MongoDB:** Ensure MongoDB is running locally or use MongoDB Atlas

### Environment Configuration

**Backend `.env` file:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-placement-system  # or MongoDB Atlas URI
JWT_SECRET=your_secure_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com/submissions
JUDGE0_API_KEY=your_judge0_rapidapi_key_here
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here  # Optional for voice
```

**Frontend `.env` file:**
```env
VITE_BACKEND_URL=http://localhost:5000/api
```

**🔑 Get Your API Keys:**
- **Groq AI:** https://console.groq.com/ (Free tier available)
- **Judge0:** https://rapidapi.com/judge0-official/api/judge0-ce
- **ElevenLabs:** https://elevenlabs.io/ (Optional, for voice features)

## 🎮 Usage

### For Users

1. **Sign Up / Login**
   - Create an account or login
   - JWT token stored in localStorage

2. **Browse & Solve Problems**
   - View all available coding problems
   - Select a problem and write code
   - Run with custom input or Submit against test cases
   - Get instant feedback

3. **AI Mock Interview**
   - Choose interview type and difficulty
   - Answer 10 AI-generated questions
   - Get instant feedback after each answer
   - View comprehensive performance report
   - Track interview history

4. **Publish Problems**
   - Create new coding problems
   - Add sample and hidden test cases
   - Set time and memory limits

5. **Resume Analysis**
   - Upload resume (PDF/TXT) or paste text
   - Get instant AI-powered analysis
   - View comprehensive scoring and feedback
   - Improve resume with AI suggestions
   - Download enhanced version

6. **Dashboard**
   - View your published problems
   - Track interview performance
   - Access interview history
   - Manage your resumes

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Problems
- `GET /api/problems/all` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems/create` - Create new problem (protected)

### Submissions
- `POST /api/submissions` - Submit code for execution

### AI Interviews (Protected)
- `POST /api/interviews/start` - Start new interview
- `POST /api/interviews/answer` - Submit answer
- `POST /api/interviews/:id/complete` - Complete interview
- `GET /api/interviews/history` - Get interview history
- `GET /api/interviews/:id` - Get interview details

### Resume Analysis (Protected)
- `POST /api/resumes/analyze-text` - Analyze resume text with Groq AI
- `POST /api/resumes/analyze-pdf` - Analyze PDF resume with Groq AI
- `POST /api/resumes/improve-text` - Improve resume text with AI

## 🎨 Features Highlights

### AI Interview System
- **Adaptive Questioning**: AI generates contextual follow-up questions using Groq's Llama 3.3 70B
- **Intelligent Evaluation**: Detailed feedback on every answer
- **Multiple Categories**: Frontend, Backend, DevOps, ML/AI, System Design, Behavioral, and more
- **Difficulty Levels**: Easy, Medium, Hard
- **Voice Interviews**: Optional voice-to-voice interviews with ElevenLabs TTS
- **Performance Analytics**: Score breakdowns and improvement suggestions
- **Question Bank**: 100+ curated interview questions

### Code Execution
- **Real-time Execution**: Powered by Judge0
- **Multiple Languages**: C, C++, Java, Python
- **Test Validation**: Compare output against expected results
- **Detailed Feedback**: Execution time, memory usage, errors

### Resume Analysis & Improvement
- **AI-Powered Analysis**: Comprehensive resume evaluation using Groq AI (Llama 3.3 70B)
- **Triple Scoring System**: Overall, ATS, and Impact scores
- **Detailed Feedback**: Strengths, weaknesses, and actionable recommendations
- **AI Enhancement**: Automatic resume improvement with better content
- **Multiple Input Methods**: Upload PDF/TXT or paste text directly
- **Instant Results**: Get analysis in 5-10 seconds
- **Downloadable Output**: Save improved resume for job applications

## 🛠️ Development

### Project Structure
```
ai-placement-readiness-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js          # User authentication
│   │   ├── problemController.js       # Coding problems CRUD
│   │   ├── submissionController.js    # Code execution
│   │   ├── interviewController.js     # AI interview logic
│   │   └── resumeController.js        # Resume analysis & improvement
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── Problem.js                 # Problem schema
│   │   ├── Interview.js               # Interview session schema
│   │   └── Resume.js                  # Resume schema
│   ├── routes/
│   │   ├── authRoutes.js              # Auth endpoints
│   │   ├── problemRoutes.js           # Problem endpoints
│   │   ├── submissionRoutes.js        # Submission endpoints
│   │   ├── interviewRoutes.js         # Interview endpoints
│   │   └── resumeRoutes.js            # Resume endpoints
│   ├── utils/
│   │   └── latexConverter.js          # LaTeX ↔ JSON conversion
│   ├── middlewares/
│   │   └── authMiddleware.js          # JWT verification
│   ├── .env.example                   # Environment template
│   ├── server.js                      # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── NavBar.jsx             # Navigation bar
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Auth state management
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing page
│   │   │   ├── Login.jsx              # Login page
│   │   │   ├── Signup.jsx             # Registration page
│   │   │   ├── Problems.jsx           # Problem list
│   │   │   ├── ProblemDetails.jsx     # Problem solver
│   │   │   ├── PublishProblem.jsx     # Create problem
│   │   │   ├── BulkPublishProblems.jsx # Bulk problem upload
│   │   │   ├── Dashboard.jsx          # User dashboard
│   │   │   ├── AIInterview.jsx        # Interview interface
│   │   │   ├── InterviewReport.jsx    # Interview results
│   │   │   └── ResumeAnalysis.jsx     # AI resume analysis
│   │   ├── utils/
│   │   │   └── api.js                 # Axios instance
│   │   ├── App.jsx                    # Main app component
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Tailwind CSS
│   └── package.json
├── .gitignore
└── README.md
```

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Protected routes with middleware
- Environment variables for sensitive data
- CORS enabled for frontend-backend communication

## 🐛 Troubleshooting

### Backend Not Starting
- Ensure MongoDB is running: `systemctl status mongod`
- Check if port 5000 is available: `lsof -i :5000`
- Verify `.env` file exists with all required variables

### "Groq AI service not available" Error
- Ensure `GROQ_API_KEY` is set in `backend/.env`
- Verify API key at https://console.groq.com/
- Restart backend after adding the key
- Check backend logs for initialization message

### Resume Analysis Returns Generic Results
- Backend logs should show: `✅ Groq AI client initialized successfully`
- If showing fallback responses, check API key and quota
- Watch backend console during analysis for error messages

### Code Execution Failing
- Verify Judge0 API key is valid
- Check Judge0 API status
- Ensure proper language ID is being sent

### Frontend Not Connecting to Backend
- Verify `VITE_BACKEND_URL` in `frontend/.env`
- Check CORS settings in backend
- Ensure both servers are running

## 🚧 Future Enhancements

- [x] Voice interviews ✅
- [x] AI Resume Builder ✅
- [x] AI Resume Analysis & Improvement ✅
- [x] LaTeX import/export ✅
- [ ] PDF parsing for resume uploads
- [ ] Video recording with facial analysis
- [ ] Real-time collaboration on problems
- [ ] Peer code review system
- [ ] Interview scheduling
- [ ] Performance leaderboards
- [ ] Company-specific interview prep
- [ ] Mobile app
- [ ] Cover letter generator

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

**Divyansh**
- GitHub: [@Divyansh10-wd](https://github.com/Divyansh10-wd)
- Repository: [ai-placement-readiness-system](https://github.com/Divyansh10-wd/ai-placement-readiness-system)

Built with ❤️ for helping developers ace their technical interviews.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support:
- Create an issue in the [GitHub repository](https://github.com/Divyansh10-wd/ai-placement-readiness-system/issues)
- Check the troubleshooting section above
- Review the environment configuration

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Happy Coding & Good Luck with Your Interviews! 🚀**
