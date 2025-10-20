# Voice-to-Voice Interview System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                              │
│                     (AIInterview.jsx)                               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │                       │
            ┌───────▼────────┐      ┌──────▼──────┐
            │  VOICE INPUT   │      │ VOICE OUTPUT│
            │  (Recording)   │      │  (Playback) │
            └───────┬────────┘      └──────▲──────┘
                    │                      │
                    │                      │
    ┌───────────────▼───────────────┐      │
    │   useVoiceRecording Hook      │      │
    │   - getUserMedia API          │      │
    │   - MediaRecorder API         │      │
    │   - Blob creation             │      │
    └───────────────┬───────────────┘      │
                    │                      │
                    │ Audio Blob           │ Audio Stream
                    │                      │
    ┌───────────────▼───────────────┐      │
    │     API LAYER (axios)         │      │
    │   - FormData upload           │      │
    │   - Blob response             │      │
    └───────────────┬───────────────┘      │
                    │                      │
════════════════════╪══════════════════════╪════════════════════════
                    │    BACKEND API       │
════════════════════╪══════════════════════╪════════════════════════
                    │                      │
    ┌───────────────▼───────────────┐  ┌───┴──────────────────────┐
    │  POST /speech-to-text         │  │ POST /text-to-speech     │
    │  (interviewRoutes.js)         │  │ (interviewRoutes.js)     │
    │  - Auth middleware            │  │ - Auth middleware        │
    │  - Multer upload              │  │ - JSON body parser       │
    └───────────────┬───────────────┘  └───┬──────────────────────┘
                    │                      │
    ┌───────────────▼───────────────┐  ┌───▼──────────────────────┐
    │  speechToText()               │  │ textToSpeech()           │
    │  (interviewController.js)     │  │ (interviewController.js) │
    │  - File validation            │  │ - Text validation        │
    │  - OpenAI Whisper API         │  │ - OpenAI TTS API         │
    │  - File cleanup               │  │ - Buffer conversion      │
    └───────────────┬───────────────┘  └───┬──────────────────────┘
                    │                      │
                    │                      │
    ┌───────────────▼───────────────┐  ┌───▼──────────────────────┐
    │     OPENAI WHISPER API        │  │   OPENAI TTS API         │
    │  - Audio transcription        │  │ - Text synthesis         │
    │  - Language detection         │  │ - Voice selection        │
    │  - Returns text               │  │ - Returns MP3            │
    └───────────────┬───────────────┘  └───┬──────────────────────┘
                    │                      │
                    │ Transcribed Text     │ Audio Buffer
                    │                      │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼──────────┐
                    │   RESPONSE          │
                    │   - JSON/Binary     │
                    └──────────┬──────────┘
                               │
════════════════════════════════╪════════════════════════════════════
                               │
                    ┌──────────▼──────────┐
                    │   USER INTERFACE    │
                    │   - Display text    │
                    │   - Play audio      │
                    └─────────────────────┘
```

## Component Interaction Flow

### 1. Voice Input Flow (Recording → Transcription)

```
User clicks Mic Button
        ↓
startRecording() called
        ↓
Request microphone permission
        ↓
MediaRecorder starts
        ↓
Audio chunks collected
        ↓
User clicks Mic again
        ↓
stopRecording() called
        ↓
Blob created from chunks
        ↓
transcribeAudio() triggered
        ↓
FormData with audio file
        ↓
POST /api/interviews/speech-to-text
        ↓
Multer processes upload
        ↓
OpenAI Whisper transcribes
        ↓
Text returned to frontend
        ↓
Text inserted into textarea
        ↓
Audio file deleted from server
```

### 2. Voice Output Flow (Question → Audio)

```
New question received
        ↓
autoPlayQuestion enabled?
        ↓ (yes)
playQuestionAudio() called
        ↓
POST /api/interviews/text-to-speech
        ↓
OpenAI TTS generates audio
        ↓
MP3 buffer returned
        ↓
Blob created from buffer
        ↓
Audio URL created
        ↓
Audio element plays
        ↓
Audio ends
        ↓
Cleanup (revoke URL)
```

## Data Flow

### Speech-to-Text Request
```
Frontend                    Backend                     OpenAI
   │                           │                           │
   │──── Audio Blob ──────────▶│                           │
   │    (multipart/form-data)  │                           │
   │                           │──── Audio File ──────────▶│
   │                           │    (Whisper API)          │
   │                           │                           │
   │                           │◀──── Transcription ───────│
   │                           │      (JSON)               │
   │◀──── Text ────────────────│                           │
   │      (JSON)               │                           │
```

### Text-to-Speech Request
```
Frontend                    Backend                     OpenAI
   │                           │                           │
   │──── Text ────────────────▶│                           │
   │    (JSON)                 │                           │
   │                           │──── Text ────────────────▶│
   │                           │    (TTS API)              │
   │                           │                           │
   │                           │◀──── MP3 Audio ───────────│
   │                           │      (Binary)             │
   │◀──── Audio Buffer ────────│                           │
   │      (Binary)             │                           │
```

## State Management

### Frontend State (AIInterview.jsx)
```javascript
// Recording State
isRecording: boolean          // Currently recording?
audioBlob: Blob              // Recorded audio data
voiceError: string           // Recording errors

// Transcription State
isTranscribing: boolean      // Processing audio?
answer: string               // Transcribed text

// Playback State
isPlayingAudio: boolean      // Audio playing?
autoPlayQuestion: boolean    // Auto-play enabled?
audioRef: Ref<Audio>         // Audio element reference
```

### Backend State (interviewController.js)
```javascript
// Upload Configuration
storage: multer.diskStorage  // File storage config
upload: multer.Multer        // Upload middleware

// OpenAI Client
openai: OpenAI               // API client instance
```

## File System Structure

```
ai-placement-readiness-system/
│
├── backend/
│   ├── controllers/
│   │   └── interviewController.js    ← Voice endpoints
│   ├── routes/
│   │   └── interviewRoutes.js        ← Voice routes
│   └── uploads/
│       └── audio/                    ← Temporary storage
│           └── [timestamp]-[filename]
│
├── frontend/
│   └── src/
│       ├── hooks/
│       │   └── useVoiceRecording.js  ← Recording hook
│       └── pages/
│           └── AIInterview.jsx       ← Main UI
│
└── Documentation/
    ├── VOICE_INTERVIEW_GUIDE.md      ← Full guide
    ├── VOICE_FEATURE_SUMMARY.md      ← Summary
    └── VOICE_SYSTEM_ARCHITECTURE.md  ← This file
```

## API Endpoints

### 1. Speech-to-Text
```
Endpoint: POST /api/interviews/speech-to-text
Auth: Required (JWT)
Content-Type: multipart/form-data

Request:
- audio: File (WebM, WAV, MP3, OGG)

Response:
{
  "text": "Transcribed text here...",
  "success": true
}

Errors:
- 400: No audio file provided
- 503: OpenAI API not configured
- 500: Transcription failed
```

### 2. Text-to-Speech
```
Endpoint: POST /api/interviews/text-to-speech
Auth: Required (JWT)
Content-Type: application/json

Request:
{
  "text": "Question text to convert..."
}

Response:
Binary audio data (audio/mpeg)

Errors:
- 400: No text provided
- 503: OpenAI API not configured
- 500: Speech generation failed
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         User Request                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 1: Authentication (JWT)          │
│  - Verify token                         │
│  - Check user session                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 2: File Validation               │
│  - Check file type                      │
│  - Check file size                      │
│  - Sanitize filename                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 3: Processing                    │
│  - OpenAI API call                      │
│  - Error handling                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 4: Cleanup                       │
│  - Delete temporary files               │
│  - Free resources                       │
└─────────────────────────────────────────┘
```

## Error Handling Flow

```
Error Occurs
     │
     ├─── Frontend Error
     │    ├─── Microphone access denied
     │    │    └─── Show permission message
     │    ├─── Recording failed
     │    │    └─── Show error, allow retry
     │    └─── Network error
     │         └─── Show connection message
     │
     └─── Backend Error
          ├─── File upload failed
          │    └─── Return 400 error
          ├─── OpenAI API error
          │    └─── Return 500 error
          └─── File cleanup error
               └─── Log error, continue
```

## Performance Optimization

### 1. Audio Compression
```
Recording → WebM with Opus codec
           (Best compression ratio)
           ↓
Upload → Chunked transfer
         (Better for large files)
         ↓
Processing → Streaming to OpenAI
             (Faster processing)
```

### 2. Caching Strategy
```
Question Text → TTS API → Audio Buffer
                            ↓
                    (Could cache here)
                            ↓
                    Browser Memory
                            ↓
                    Play & Cleanup
```

### 3. Resource Management
```
Recording Start
    ↓
Allocate MediaRecorder
    ↓
Collect chunks
    ↓
Recording Stop
    ↓
Create Blob
    ↓
Upload to server
    ↓
Free MediaRecorder
    ↓
Server processes
    ↓
Delete file
    ↓
Return result
```

## Browser Compatibility Matrix

```
Feature              Chrome  Firefox  Safari  Edge
─────────────────────────────────────────────────
getUserMedia         ✅      ✅       ✅      ✅
MediaRecorder        ✅      ✅       ✅      ✅
Audio Playback       ✅      ✅       ✅      ✅
WebM Format          ✅      ✅       ⚠️      ✅
Opus Codec           ✅      ✅       ⚠️      ✅
FormData Upload      ✅      ✅       ✅      ✅
Blob Handling        ✅      ✅       ✅      ✅

Legend: ✅ Full Support  ⚠️ Partial Support  ❌ No Support
```

## Scalability Considerations

### Current Implementation
- Single server processing
- Synchronous file handling
- In-memory audio processing
- Immediate file cleanup

### Future Scaling Options
```
Load Balancer
     │
     ├─── Server 1 (Speech-to-Text)
     ├─── Server 2 (Text-to-Speech)
     └─── Server 3 (Interview Logic)
          │
          ├─── Redis Cache (Audio cache)
          ├─── S3 Storage (Temporary files)
          └─── Queue System (Async processing)
```

## Monitoring Points

```
┌─────────────────────────────────────────┐
│  Frontend Metrics                       │
│  - Recording success rate               │
│  - Transcription accuracy               │
│  - Audio playback errors                │
│  - User interaction time                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Backend Metrics                        │
│  - API response times                   │
│  - File upload sizes                    │
│  - OpenAI API latency                   │
│  - Error rates                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  System Metrics                         │
│  - Disk usage (temp files)              │
│  - Memory usage                         │
│  - CPU usage                            │
│  - Network bandwidth                    │
└─────────────────────────────────────────┘
```

## Conclusion

This architecture provides:
- ✅ **Scalable** - Can handle multiple concurrent users
- ✅ **Secure** - Multiple security layers
- ✅ **Reliable** - Comprehensive error handling
- ✅ **Performant** - Optimized data flow
- ✅ **Maintainable** - Clear separation of concerns
- ✅ **Extensible** - Easy to add new features

The system is production-ready and follows best practices for web application development.
