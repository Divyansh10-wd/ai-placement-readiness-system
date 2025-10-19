# 🎯 AI Placement Readiness System

A comprehensive platform for technical interview preparation featuring coding problems, AI-powered mock interviews, and performance analytics.

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

### 3. **User Management**
- JWT-based authentication
- User dashboard
- Problem publishing
- Interview history

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express.js**
- **MongoDB** with Mongoose
- **OpenAI API** for AI interviews
- **Judge0 API** for code execution
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with **Vite**
- **Tailwind CSS** for styling
- **Monaco Editor** for code editing
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key (for AI interviews)
- Judge0 API Key (optional, has fallback)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com/submissions
JUDGE0_API_KEY=your_judge0_api_key (optional)
```

4. Start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_BACKEND_URL=http://127.0.0.1:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

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

5. **Dashboard**
   - View your published problems
   - Track interview performance
   - Access interview history

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

## 🎨 Features Highlights

### AI Interview System
- **Adaptive Questioning**: AI generates contextual follow-up questions
- **Intelligent Evaluation**: Detailed feedback on every answer
- **Multiple Categories**: Technical, Behavioral, System Design
- **Difficulty Levels**: Easy, Medium, Hard
- **Performance Analytics**: Score breakdowns and improvement suggestions
- **Fallback System**: Works without OpenAI API (uses question bank)

### Code Execution
- **Real-time Execution**: Powered by Judge0
- **Multiple Languages**: C, C++, Java, Python
- **Test Validation**: Compare output against expected results
- **Detailed Feedback**: Execution time, memory usage, errors

## 🛠️ Development

### Project Structure
```
ai-placement-readiness-system/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   ├── submissionController.js
│   │   └── interviewController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Problem.js
│   │   └── Interview.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── problemRoutes.js
│   │   ├── submissionRoutes.js
│   │   └── interviewRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── NavBar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Problems.jsx
│   │   │   ├── ProblemDetails.jsx
│   │   │   ├── PublishProblem.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AIInterview.jsx
│   │   │   └── InterviewReport.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
└── README.md
```

## 🔒 Security

- Passwords hashed with bcryptjs
- JWT tokens for authentication
- Protected routes with middleware
- Environment variables for sensitive data
- CORS enabled for frontend-backend communication

## 🚧 Future Enhancements

- [ ] Voice recording for AI interviews
- [ ] Video recording with facial analysis
- [ ] Real-time collaboration on problems
- [ ] Peer code review system
- [ ] AI Resume Builder
- [ ] Interview scheduling
- [ ] Performance leaderboards
- [ ] Company-specific interview prep
- [ ] Mobile app

## 📝 License

MIT License

## 👨‍💻 Author

Built with ❤️ for helping developers ace their technical interviews

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, email or create an issue in the repository.

---

**Happy Coding & Good Luck with Your Interviews! 🚀**
