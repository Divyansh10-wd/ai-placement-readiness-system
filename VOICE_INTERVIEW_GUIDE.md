# Voice-to-Voice Interview System Guide

## Overview
The AI Placement Readiness System now includes a complete **voice-to-voice interview system** that allows candidates to practice interviews using natural speech, just like a real interview scenario.

## Features

### 🎙️ Speech-to-Text (Voice Input)
- **Record your answers** by clicking the microphone button
- Automatic transcription using OpenAI's Whisper API
- Real-time status indicators showing recording and transcription progress
- Supports multiple audio formats (WebM, WAV, MP3, OGG)
- Seamless integration with text input (you can type or speak)

### 🔊 Text-to-Speech (Voice Output)
- **Questions are read aloud** automatically when displayed
- Uses OpenAI's TTS API with natural-sounding voice (Alloy)
- Manual playback control with play/stop button
- Toggle auto-play on/off with speaker icon
- High-quality audio streaming

### 🎯 User Experience
- **Visual feedback** during recording (pulsing red indicator)
- **Transcription status** with loading spinner
- **Error handling** with clear user messages
- **Audio controls** easily accessible in the UI
- **Responsive design** works on all devices

## How It Works

### Backend Architecture

#### 1. Speech-to-Text Endpoint
```
POST /api/interviews/speech-to-text
```
- Accepts audio file upload (multipart/form-data)
- Uses OpenAI Whisper API for transcription
- Returns transcribed text
- Automatically cleans up uploaded files

#### 2. Text-to-Speech Endpoint
```
POST /api/interviews/text-to-speech
```
- Accepts text in request body
- Uses OpenAI TTS API to generate audio
- Streams MP3 audio back to client
- Configurable voice and speed

#### 3. File Upload Configuration
- **Storage:** Local filesystem (`backend/uploads/audio/`)
- **Size limit:** 25MB per file
- **Allowed formats:** audio/webm, audio/wav, audio/mp3, audio/mpeg, audio/ogg
- **Auto-cleanup:** Files deleted after processing

### Frontend Implementation

#### 1. Voice Recording Hook (`useVoiceRecording.js`)
Custom React hook that handles:
- Microphone access via `getUserMedia` API
- Audio recording with `MediaRecorder` API
- Blob creation for upload
- Error handling for permissions

#### 2. Interview Component Updates
Enhanced `AIInterview.jsx` with:
- Voice recording state management
- Audio transcription integration
- Question audio playback
- Auto-play toggle
- Visual status indicators

## User Workflow

### Starting an Interview
1. Select interview type and difficulty
2. See voice features highlighted in "What to Expect"
3. Click "Start Interview"

### During the Interview
1. **Question appears** and is automatically read aloud (if auto-play is on)
2. **Listen to question** or read it on screen
3. **Record answer:**
   - Click microphone button to start recording
   - Speak your answer clearly
   - Click microphone again to stop
   - Audio is automatically transcribed to text
4. **Edit if needed** - transcribed text appears in textarea
5. **Submit answer** - get instant AI feedback
6. **Next question** loads automatically

### Controls Available
- 🔊 **Speaker icon:** Toggle auto-play on/off
- 🎙️ **Microphone button:** Start/stop recording
- ▶️ **Play Question button:** Manually replay question
- ⏹️ **Stop button:** Stop audio playback

## Technical Requirements

### Backend Dependencies
- `openai` (v4.20.0+) - For Whisper and TTS APIs
- `multer` (v1.4.5+) - For file uploads
- `fs` & `path` - For file management

### Frontend Dependencies
- React hooks (`useState`, `useEffect`, `useRef`)
- Browser APIs:
  - `MediaRecorder` - For audio recording
  - `getUserMedia` - For microphone access
  - `Audio` - For playback

### API Requirements
- **OpenAI API Key** must be configured in `.env`
- Requires access to:
  - Whisper API (speech-to-text)
  - TTS API (text-to-speech)

## Configuration

### Environment Variables
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### Voice Settings (Customizable in code)
```javascript
// Text-to-Speech settings (interviewController.js)
{
  model: 'tts-1',           // or 'tts-1-hd' for higher quality
  voice: 'alloy',           // Options: alloy, echo, fable, onyx, nova, shimmer
  speed: 1.0                // 0.25 to 4.0
}

// Speech-to-Text settings
{
  model: 'whisper-1',
  language: 'en'            // Can support other languages
}
```

## Error Handling

### Common Issues and Solutions

#### 1. Microphone Access Denied
- **Error:** "Failed to access microphone. Please check permissions."
- **Solution:** Grant microphone permissions in browser settings

#### 2. OpenAI API Not Configured
- **Error:** "OpenAI API not configured"
- **Solution:** Add OPENAI_API_KEY to backend .env file

#### 3. Audio Format Not Supported
- **Error:** "Invalid file type. Only audio files are allowed."
- **Solution:** Browser will automatically use supported format

#### 4. Transcription Failed
- **Error:** "Failed to transcribe audio. Please try again."
- **Solution:** Check internet connection and API key validity

## Performance Considerations

### Audio File Sizes
- WebM with Opus codec provides best compression
- Typical 1-minute recording: ~500KB - 1MB
- 25MB limit allows ~25-50 minutes of recording

### API Costs (OpenAI)
- **Whisper:** $0.006 per minute of audio
- **TTS:** $0.015 per 1,000 characters (standard)
- Example: 10-question interview (~10 minutes audio + ~5,000 chars TTS) ≈ $0.14

### Latency
- **Transcription:** 2-5 seconds for 1-minute audio
- **TTS generation:** 1-2 seconds for typical question
- **Audio streaming:** Instant playback start

## Browser Compatibility

### Fully Supported
- ✅ Chrome 49+
- ✅ Firefox 25+
- ✅ Edge 79+
- ✅ Safari 14.1+
- ✅ Opera 36+

### Partial Support
- ⚠️ Mobile browsers (may have limitations on audio formats)
- ⚠️ Older browsers (fallback to text-only mode)

## Security Considerations

1. **Audio files are temporary** - deleted immediately after transcription
2. **Authentication required** - All endpoints protected with JWT
3. **File size limits** - Prevents abuse with 25MB cap
4. **File type validation** - Only audio files accepted
5. **No persistent storage** - Audio not saved on server

## Future Enhancements

### Potential Improvements
- [ ] Real-time streaming transcription
- [ ] Multiple voice options for TTS
- [ ] Language selection for interviews
- [ ] Audio quality settings
- [ ] Offline mode with browser-based speech recognition
- [ ] Voice analysis (pace, clarity, confidence)
- [ ] Practice mode with pronunciation feedback

## Testing

### Manual Testing Checklist
- [ ] Microphone permission request works
- [ ] Recording starts and stops correctly
- [ ] Audio transcription is accurate
- [ ] Questions play automatically
- [ ] Manual play/stop controls work
- [ ] Auto-play toggle functions
- [ ] Error messages display properly
- [ ] Audio cleanup happens after transcription
- [ ] Works on different browsers
- [ ] Mobile responsiveness

### API Testing
```bash
# Test Speech-to-Text
curl -X POST http://localhost:5000/api/interviews/speech-to-text \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "audio=@test-audio.webm"

# Test Text-to-Speech
curl -X POST http://localhost:5000/api/interviews/text-to-speech \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text":"What is your experience with React?"}' \
  --output question.mp3
```

## Troubleshooting

### Debug Mode
Enable console logging to see detailed information:
```javascript
// In interviewController.js
console.log('Processing audio file:', audioFilePath);
console.log('Converting text to speech:', text);

// In AIInterview.jsx
console.log('Recording state:', isRecording);
console.log('Audio blob:', audioBlob);
```

### Common Debug Steps
1. Check browser console for errors
2. Verify OpenAI API key is valid
3. Test microphone in browser settings
4. Check network tab for API responses
5. Verify audio file is being created
6. Check backend logs for errors

## Support

For issues or questions:
1. Check this guide first
2. Review browser console errors
3. Check backend server logs
4. Verify API key and permissions
5. Test with different browsers

## Credits

- **OpenAI Whisper** - Speech recognition
- **OpenAI TTS** - Text-to-speech synthesis
- **MediaRecorder API** - Browser audio recording
- **React** - Frontend framework
- **Express.js** - Backend framework
