# ElevenLabs Setup Guide

## 🎙️ Why ElevenLabs?

- ✅ **10,000 characters/month FREE** (vs OpenAI's paid-only)
- ✅ **Better voice quality** - More natural and expressive
- ✅ **Multiple voices** - Choose from various options
- ✅ **Easy setup** - Simple API integration
- ✅ **No credit card required** for free tier

## 📝 Step-by-Step Setup

### Step 1: Create ElevenLabs Account

1. **Go to:** https://elevenlabs.io/
2. **Click:** "Sign Up" (top right)
3. **Sign up with:**
   - Email
   - Google account
   - Or GitHub

### Step 2: Get Your API Key

1. **Login to:** https://elevenlabs.io/
2. **Click** on your profile icon (top right)
3. **Select:** "Profile"
4. **Scroll down** to "API Key" section
5. **Click:** "Copy" to copy your API key
6. **Save it** - you'll need it in the next step

### Step 3: Add API Key to Your Project

Run this command:

```bash
cd /home/divyansh/EndSem/ai-placement-readiness-system/backend
nano .env
```

Find the line:
```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

Replace with your actual key:
```env
ELEVENLABS_API_KEY=your_actual_api_key_from_elevenlabs
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 4: Restart Backend Server

The backend will automatically restart if using nodemon, or manually restart:

```bash
# If backend is running, it will auto-restart
# Or manually restart:
npm run dev
```

## 🎯 What You Get

### Free Tier Limits
- **10,000 characters/month** - Approximately:
  - ~100 interview questions read aloud
  - ~50 complete interview sessions
  - Resets every month

### Voice Options

The system uses **Rachel** voice by default (natural female voice).

You can change to other voices by updating the `VOICE_ID` in `interviewController.js`:

```javascript
// Popular voice IDs:
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel (default)
// const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella
// const VOICE_ID = 'ErXwobaYiN019PkySvjV'; // Antoni
// const VOICE_ID = 'VR6AewLTigWG4xSOukaG'; // Arnold
// const VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam
```

To see all available voices:
https://api.elevenlabs.io/v1/voices

## 🔧 Current System Features

### With ElevenLabs Integration:
- ✅ **Text-to-Speech** - Questions read aloud with high quality
- ✅ **Browser Speech Recognition** - FREE voice input (no API needed)
- ✅ **AI Evaluation** - Uses OpenAI for answer evaluation
- ✅ **Interview Questions** - Built-in question bank

### Voice Input (Browser-based - FREE)
- Uses Web Speech API (Chrome/Edge)
- No API costs
- Works offline
- Real-time transcription

### Voice Output (ElevenLabs)
- High-quality natural voices
- 10,000 chars/month free
- Multiple voice options
- Fast generation

## 💰 Cost Comparison

| Feature | OpenAI | ElevenLabs | Browser API |
|---------|--------|------------|-------------|
| Speech-to-Text | $0.006/min | N/A | **FREE** |
| Text-to-Speech | $0.015/1K chars | **FREE** (10K/mo) | N/A |
| Quality | Good | **Excellent** | Good |
| Free Tier | No | **Yes** | **Yes** |

## 🚀 Testing

After setup, test the voice features:

1. **Start an interview**
2. **Click "Play Question"** - Should hear high-quality voice
3. **Click microphone** - Browser speech recognition
4. **Speak your answer** - Transcribed in real-time
5. **Submit** - Get AI feedback

## 🐛 Troubleshooting

### Issue: "ElevenLabs API not configured"
**Solution:** Add API key to `.env` file and restart backend

### Issue: No audio plays
**Solution:** 
- Check browser audio settings
- Verify API key is correct
- Check ElevenLabs dashboard for usage limits

### Issue: Voice input not working
**Solution:**
- Use Chrome or Edge browser
- Grant microphone permissions
- Check if microphone is working in system settings

## 📊 Monitor Usage

Check your usage at:
https://elevenlabs.io/app/usage

You can see:
- Characters used this month
- Remaining characters
- Usage history

## 🎉 Benefits of This Setup

### Cost-Effective
- ✅ **FREE voice input** (browser-based)
- ✅ **FREE voice output** (10K chars/month)
- ✅ Only pay for AI evaluation (OpenAI)

### High Quality
- ✅ Natural-sounding voices
- ✅ Accurate transcription
- ✅ Professional experience

### Easy to Use
- ✅ Simple setup
- ✅ No complex configuration
- ✅ Works out of the box

## 🔄 Upgrade Options

If you need more:

### ElevenLabs Paid Plans
- **Starter:** $5/mo - 30,000 chars
- **Creator:** $22/mo - 100,000 chars
- **Pro:** $99/mo - 500,000 chars

But the **free tier is perfect** for personal use and practice!

## 📝 Summary

Your system now uses:
1. **ElevenLabs** - High-quality text-to-speech (FREE 10K/mo)
2. **Browser Speech API** - Voice input (FREE unlimited)
3. **OpenAI** - AI evaluation and question generation

This gives you the **best of all worlds**:
- ✅ High quality
- ✅ Low cost
- ✅ Easy setup
- ✅ Professional experience

---

**Ready to get started?**

1. Sign up at https://elevenlabs.io/
2. Get your API key
3. Add it to `.env`
4. Restart backend
5. Start interviewing! 🎤
