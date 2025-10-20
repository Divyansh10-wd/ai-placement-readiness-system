# Quick Start Guide - Voice-to-Voice Interview System

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- ✅ Node.js installed
- ✅ OpenAI API key
- ✅ Microphone access
- ✅ Modern web browser

### Step 1: Configure OpenAI API Key

```bash
# Navigate to backend directory
cd /home/divyansh/EndSem/ai-placement-readiness-system/backend

# Create or edit .env file
echo "OPENAI_API_KEY=your_actual_api_key_here" >> .env
```

### Step 2: Start Backend Server

```bash
# In backend directory
npm install  # If not already done
npm run dev
```

Expected output:
```
Server running on port 5000
MongoDB connected
```

### Step 3: Start Frontend

```bash
# Open new terminal
cd /home/divyansh/EndSem/ai-placement-readiness-system/frontend

npm install  # If not already done
npm run dev
```

Expected output:
```
Local: http://localhost:5173
```

### Step 4: Test Voice Features

1. **Open browser:** http://localhost:5173
2. **Login/Register** to your account
3. **Navigate** to "AI Interview" section
4. **Select** interview type and difficulty
5. **Click** "Start Interview"

### Step 5: Try Voice Recording

1. **Allow microphone access** when prompted
2. **Listen** to the question (auto-played)
3. **Click microphone button** to start recording
4. **Speak your answer** clearly
5. **Click microphone again** to stop
6. **Watch** as your speech is transcribed
7. **Submit** your answer

## 🎯 Quick Test Checklist

### Basic Functionality
- [ ] Microphone permission granted
- [ ] Recording button works
- [ ] Audio transcription appears
- [ ] Questions play automatically
- [ ] Manual play button works
- [ ] Auto-play toggle works
- [ ] Submit answer works
- [ ] Next question loads

### Voice Features
- [ ] Recording indicator shows
- [ ] Transcription spinner appears
- [ ] Text appears in textarea
- [ ] Audio plays smoothly
- [ ] Stop button works
- [ ] Error messages display (if any)

## 🎤 Testing Voice Recording

### Test Script
Say this into the microphone:
```
"React is a JavaScript library for building user interfaces. 
It uses a component-based architecture and a virtual DOM 
for efficient rendering. React was developed by Facebook 
and is widely used in modern web development."
```

Expected result:
- Text should appear in the answer box
- Should be ~90% accurate
- Takes 2-5 seconds to transcribe

## 🔊 Testing Audio Playback

### What to Expect
- Question appears on screen
- Audio starts playing automatically (if auto-play is on)
- Natural-sounding voice reads the question
- Play/Stop button controls playback
- Speaker icon toggles auto-play

## 🐛 Troubleshooting

### Issue: Microphone not working
```bash
# Check browser console (F12)
# Look for: "Failed to access microphone"

Solution:
1. Click lock icon in address bar
2. Allow microphone access
3. Refresh page
```

### Issue: "OpenAI API not configured"
```bash
# Check backend .env file
cat backend/.env | grep OPENAI_API_KEY

Solution:
1. Add valid API key to .env
2. Restart backend server
```

### Issue: Transcription fails
```bash
# Check backend logs
# Look for: "Speech-to-text error"

Solution:
1. Verify API key has credits
2. Check internet connection
3. Try recording again
```

### Issue: No audio playback
```bash
# Check browser console
# Look for: "TTS error"

Solution:
1. Check browser audio settings
2. Unmute browser tab
3. Try manual play button
```

## 📊 Verify Installation

### Backend Health Check
```bash
# Test speech-to-text endpoint
curl -X POST http://localhost:5000/api/interviews/speech-to-text \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "audio=@test.webm"

# Expected: {"text": "...", "success": true}
```

### Frontend Check
```bash
# Open browser console (F12)
# Navigate to AI Interview
# Check for errors

# Should see:
# - No console errors
# - Network requests successful
# - Audio elements present
```

## 🎨 UI Elements to Look For

### Interview Setup Screen
- 🎙️ Voice feature mentioned in "What to Expect"
- Clear instructions about voice mode

### Interview Screen
- 🔊 Speaker icon (top right of answer section)
- 🎙️ Microphone button (animated when recording)
- ▶️ Play Question button (next to question)
- 📊 Status indicators (recording, transcribing)

## 💡 Pro Tips

### For Best Results
1. **Use a good microphone** - Built-in laptop mic works, but external is better
2. **Speak clearly** - Natural pace, not too fast
3. **Minimize background noise** - Find a quiet space
4. **Check volume** - Ensure microphone isn't muted
5. **Use Chrome/Firefox** - Best browser support

### Voice Recording Tips
- Pause briefly before starting to speak
- Speak at normal conversation volume
- If transcription is wrong, you can edit the text
- You can record multiple times

### Audio Playback Tips
- Adjust system volume if too quiet
- Use headphones for better audio quality
- Toggle auto-play off if you prefer to read
- Manual play button replays the question

## 📈 Performance Expectations

### Normal Operation
- **Recording:** Instant start/stop
- **Transcription:** 2-5 seconds
- **Audio generation:** 1-2 seconds
- **Playback:** Immediate

### If Slower
- Check internet speed
- Verify OpenAI API status
- Check system resources
- Try shorter recordings

## 🔐 Security Notes

### What's Stored
- ❌ Audio files are NOT stored permanently
- ❌ Recordings are NOT saved to database
- ✅ Only transcribed text is saved
- ✅ Files deleted immediately after processing

### Privacy
- Audio processed by OpenAI Whisper API
- Subject to OpenAI's privacy policy
- No audio data retained after transcription
- All requests authenticated with JWT

## 📱 Mobile Testing

### Supported
- ✅ Modern mobile browsers
- ✅ Microphone access
- ✅ Audio playback

### Limitations
- ⚠️ Some audio formats may differ
- ⚠️ Background recording may pause
- ⚠️ Battery usage higher

### Mobile Tips
- Use WiFi for better performance
- Keep app in foreground while recording
- Grant microphone permissions
- Test audio playback volume

## 🎯 Success Indicators

### Everything Working
- ✅ Microphone icon appears
- ✅ Recording indicator animates
- ✅ Transcription shows progress
- ✅ Text appears automatically
- ✅ Questions play with audio
- ✅ No error messages

### Need to Fix
- ❌ Permission denied errors
- ❌ API configuration errors
- ❌ Network timeout errors
- ❌ Audio playback fails

## 📞 Getting Help

### Debug Information to Collect
1. Browser console errors (F12)
2. Network tab responses
3. Backend server logs
4. OpenAI API key status
5. Browser/OS version

### Common Solutions
- Clear browser cache
- Restart servers
- Check API key validity
- Update browser
- Check firewall settings

## 🎉 You're Ready!

If you can:
- ✅ Record your voice
- ✅ See transcribed text
- ✅ Hear questions played
- ✅ Submit answers
- ✅ Get AI feedback

**Congratulations! The voice-to-voice system is working perfectly!**

## 🚀 Next Steps

1. **Practice interviews** with voice mode
2. **Try different interview types** (Frontend, Backend, etc.)
3. **Experiment with difficulty levels**
4. **Review your interview reports**
5. **Share feedback** on the experience

## 📚 Additional Resources

- **Full Guide:** `VOICE_INTERVIEW_GUIDE.md`
- **Architecture:** `VOICE_SYSTEM_ARCHITECTURE.md`
- **Summary:** `VOICE_FEATURE_SUMMARY.md`

---

**Happy Interviewing! 🎤🎧**
