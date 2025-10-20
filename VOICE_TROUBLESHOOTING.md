# Voice Features Troubleshooting Guide

## 🔴 "Speech recognition error: network"

### What This Means:
Browser-based speech recognition (Web Speech API) requires an **active internet connection** to work. The browser sends audio to Google's servers for processing.

### ✅ Solutions:

#### Option 1: Check Your Internet Connection
1. **Verify internet is working:**
   - Open a new tab and visit any website
   - Check if you can load pages normally
   
2. **Check connection stability:**
   - Run: `ping google.com` in terminal
   - Ensure stable connection (no packet loss)

3. **Try again:**
   - Refresh the page
   - Click microphone button again

#### Option 2: Use Typing Instead (Always Works)
- **Just type your answer** in the text box
- No internet required for typing
- Works exactly the same way
- Still get AI feedback

#### Option 3: Switch Networks
- Try a different WiFi network
- Use mobile hotspot if available
- Check if firewall is blocking

## 🎤 Other Voice Input Issues

### Issue: "Microphone access denied"
**Solution:**
1. Click the lock icon in browser address bar
2. Find "Microphone" permissions
3. Select "Allow"
4. Refresh the page

### Issue: "No speech detected"
**Solution:**
1. Check microphone volume in system settings
2. Speak louder and clearer
3. Move closer to microphone
4. Test microphone in system settings first

### Issue: "Microphone not found"
**Solution:**
1. Connect a microphone
2. Check if it's selected as default in system settings
3. Restart browser
4. Try a different browser (Chrome/Edge recommended)

## 🔊 Voice Output Issues

### Issue: "Play Question" button doesn't work
**Possible causes:**

#### 1. ElevenLabs API Not Configured
**Check:**
```bash
cd /home/divyansh/EndSem/ai-placement-readiness-system/backend
grep ELEVENLABS_API_KEY .env
```

**Solution:**
- Add your ElevenLabs API key to `.env`
- Restart backend server
- See `ELEVENLABS_SETUP.md` for details

#### 2. No Audio Output
**Solution:**
- Check browser audio settings
- Unmute the tab
- Check system volume
- Try headphones

#### 3. API Quota Exceeded
**Solution:**
- Check usage at https://elevenlabs.io/app/usage
- Wait for monthly reset
- Or upgrade plan

## 🌐 Browser Compatibility

### ✅ Recommended Browsers:
- **Chrome** (best support)
- **Edge** (best support)

### ⚠️ Limited Support:
- **Firefox** (speech recognition may not work)
- **Safari** (speech recognition not supported)

### 💡 Tip:
If voice features don't work, **typing always works** and provides the same experience!

## 🔧 Technical Details

### Why Network is Required for Voice Input:

Browser speech recognition uses:
- **Web Speech API** (built into Chrome/Edge)
- **Google Cloud Speech** (backend processing)
- Requires internet to send audio to Google servers
- Free to use, but needs connection

### Voice Output (ElevenLabs):
- Requires internet to generate audio
- Uses ElevenLabs API
- 10,000 characters/month free
- High-quality natural voices

## 📊 Feature Comparison

| Feature | Voice Input | Typing |
|---------|-------------|--------|
| **Internet Required** | ✅ Yes | ❌ No |
| **Microphone Required** | ✅ Yes | ❌ No |
| **Browser Support** | Chrome/Edge only | All browsers |
| **Speed** | Fast (real-time) | Depends on typing speed |
| **Accuracy** | ~90-95% | 100% (you control) |
| **Cost** | FREE | FREE |

## 🎯 Best Practices

### For Voice Input:
1. **Use Chrome or Edge browser**
2. **Ensure stable internet connection**
3. **Grant microphone permissions**
4. **Speak clearly at normal pace**
5. **Use in quiet environment**
6. **Review transcription before submitting**

### For Voice Output:
1. **Check ElevenLabs API is configured**
2. **Use headphones for better quality**
3. **Adjust volume as needed**
4. **Click "Play Question" to replay**

### Fallback Strategy:
- **Always have typing as backup**
- Voice features enhance experience
- But typing works 100% of the time
- No difference in AI evaluation

## 🚀 Quick Fixes

### Voice Input Not Working?
```
1. Check internet connection
2. Use Chrome or Edge
3. Allow microphone permissions
4. Or just type your answer!
```

### Voice Output Not Working?
```
1. Check ElevenLabs API key in .env
2. Restart backend server
3. Check browser audio settings
4. Or just read the question!
```

## 💡 Pro Tips

### Hybrid Approach:
- **Read the question** (no audio needed)
- **Type your answer** (no voice input needed)
- **Get AI feedback** (works always)
- Still get full interview experience!

### When to Use Voice:
- ✅ Good internet connection
- ✅ Quiet environment
- ✅ Want realistic interview practice
- ✅ Prefer speaking over typing

### When to Use Typing:
- ✅ Unstable internet
- ✅ Noisy environment
- ✅ No microphone available
- ✅ Prefer to think while typing

## 📞 Still Having Issues?

### Debug Steps:
1. **Open browser console** (F12)
2. **Check for error messages**
3. **Look at Network tab**
4. **Check backend logs**

### Common Error Messages:

| Error | Meaning | Solution |
|-------|---------|----------|
| `network` | No internet | Check connection |
| `not-allowed` | No permission | Allow microphone |
| `no-speech` | Can't hear you | Speak louder |
| `audio-capture` | No microphone | Connect microphone |

## ✅ System Requirements

### For Voice Input:
- ✅ Chrome or Edge browser
- ✅ Active internet connection
- ✅ Working microphone
- ✅ Microphone permissions granted

### For Voice Output:
- ✅ Any modern browser
- ✅ Active internet connection
- ✅ ElevenLabs API configured
- ✅ Audio output device

### For Typing (Always Works):
- ✅ Any browser
- ❌ No internet required
- ❌ No microphone required
- ❌ No special setup required

## 🎉 Remember:

**Voice features are OPTIONAL enhancements!**

The interview system works perfectly with:
- ✅ Reading questions (no audio)
- ✅ Typing answers (no voice input)
- ✅ Getting AI feedback (always works)

Voice features make it more realistic, but **typing is always a valid option**!

---

**Need more help?** Check:
- `FINAL_SETUP_GUIDE.md` - Complete setup
- `ELEVENLABS_SETUP.md` - Voice output setup
- Browser console (F12) - Error details
