# 🤖 AgroSmart Chatbot - LM Studio Setup Guide

## Overview
The AgroSmart chatbot uses **LM Studio** - a user-friendly desktop app for running local AI models. It's much easier than command-line tools and has a beautiful GUI!

## Why LM Studio?

✅ **Easy to Use** - Simple GUI, no command line needed
✅ **Model Browser** - Download models with one click
✅ **Visual Progress** - See download progress and model status
✅ **OpenAI Compatible** - Uses standard API format
✅ **Performance Metrics** - See tokens/second in real-time
✅ **No Configuration** - Just download, load, and run!

## Installation Steps

### 1. Download LM Studio

1. Visit [https://lmstudio.ai](https://lmstudio.ai)
2. Click **Download** for Windows
3. Run the installer (no admin rights needed)
4. LM Studio will open automatically

### 2. Download LLaMA 2 7B Model

**In LM Studio:**

1. Click the **🔍 Search** icon (left sidebar)
2. In the search box, type: `llama-2-7b`
3. Look for models like:
   - **TheBloke/Llama-2-7B-Chat-GGUF** (Recommended)
   - Or search: `llama-2-7b-chat` 
4. Click the model you want
5. Choose a quantization (recommended: **Q4_K_M**):
   - **Q4_K_M** - Good balance (4GB RAM, fast)
   - **Q5_K_M** - Better quality (5GB RAM)
   - **Q8_0** - Best quality (8GB RAM, slower)
6. Click **Download**
7. Wait for download to complete (progress bar shows status)

**Alternative Models (if you prefer):**
- **Mistral-7B-Instruct** - Excellent for conversations
- **Phi-3-mini** - Smaller, faster (3.8B parameters)
- **LLaMA 3.2 3B** - Latest from Meta

### 3. Load the Model

1. Click **💬 Chat** icon (left sidebar)
2. At the top, click **Select a model to load**
3. Choose your downloaded model (e.g., `llama-2-7b-chat.Q4_K_M.gguf`)
4. Click **Load Model**
5. Wait for "Model loaded" message (5-10 seconds)

### 4. Start the Local Server

1. Click the **↔** (Local Server) icon in the left sidebar
2. Make sure **Port** is set to `1234`
3. Click the **Start Server** button (green)
4. You should see: "Server running on http://localhost:1234"

**Important Settings:**
- **Port:** 1234 (default)
- **CORS:** Enable if needed
- **API Format:** OpenAI Compatible (default)

### 5. Test the Server

**In LM Studio's Chat tab:**
Type: "What is the best crop for high humidity?"

If you get a response, the model is working!

**Or test with curl:**
```powershell
curl http://localhost:1234/v1/models
```

Should return: `{"object":"list","data":[{"id":"local-model",...}]}`

### 6. Start Your AgroSmart System

**Terminal 1 - Backend:**
```powershell
cd C:\Users\Jason Dsouza\Desktop\crop_project
.\venv\Scripts\python.exe prediction_server.py
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\Jason Dsouza\Desktop\crop_project\frontend
npm run dev
```

### 7. Use the Chatbot!

1. Open `http://localhost:8080` in your browser
2. Click the floating chat icon (bottom-right)
3. Ask: "Should I water my crops right now?"
4. Watch the AI respond with context-aware advice!

## 🎯 Quick Start Checklist

- [ ] Downloaded LM Studio from lmstudio.ai
- [ ] Installed LM Studio
- [ ] Downloaded LLaMA 2 7B model (Q4_K_M)
- [ ] Loaded model in Chat tab
- [ ] Started Local Server (port 1234)
- [ ] Started Flask backend
- [ ] Started frontend
- [ ] Tested chatbot in browser

## 💬 LM Studio Interface Guide

### Left Sidebar Icons:

1. **🔍 Search** - Download new models
2. **💬 Chat** - Test models, chat interface
3. **↔ Local Server** - Start/stop API server
4. **⚙️ Settings** - Configure LM Studio

### Top Bar (in Chat):

- **Model Selector** - Switch between loaded models
- **Temperature** - Creativity (0.7 = balanced)
- **Max Tokens** - Response length
- **System Prompt** - Instructions for AI

### Bottom Status:

- **Tokens/sec** - Generation speed
- **RAM Usage** - Memory consumption
- **Model Status** - Loaded/Unloaded

## 🔧 Configuration

### In LM Studio:

**For Better Performance:**
1. Go to Settings (⚙️)
2. Enable **GPU Acceleration** (if you have NVIDIA GPU)
3. Adjust **Context Length** (2048 = faster, 4096 = more context)
4. Set **Threads** to your CPU core count

**For Better Quality:**
1. Increase **Temperature** to 0.8-0.9 (more creative)
2. Download higher quantization (Q5_K_M or Q8_0)
3. Increase **Max Tokens** to 500+

### In Your Code:

The code is already configured for LM Studio! But you can adjust:

**Edit `prediction_server.py` around line 222:**
```python
lmstudio_payload = {
    "temperature": 0.7,  # 0.5 = conservative, 0.9 = creative
    "max_tokens": 200,   # Increase for longer responses (200-500)
}
```

## 📊 Model Comparison

| Model | Size | RAM | Speed | Quality | Best For |
|-------|------|-----|-------|---------|----------|
| LLaMA 2 7B (Q4_K_M) | 4GB | 6GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | **Recommended** |
| LLaMA 2 7B (Q5_K_M) | 5GB | 7GB | ⚡⚡ | ⭐⭐⭐⭐⭐ | Best quality |
| Mistral 7B | 4GB | 6GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Conversations |
| Phi-3-mini | 2GB | 4GB | ⚡⚡⚡⚡ | ⭐⭐⭐ | Low RAM |
| LLaMA 3.2 3B | 2GB | 4GB | ⚡⚡⚡⚡ | ⭐⭐⭐ | Fast & good |

## 🧪 Testing

### Test 1: LM Studio Server
In LM Studio's Chat tab, send a message. If the AI responds, the model works!

### Test 2: API Endpoint
```powershell
curl http://localhost:1234/v1/models
```

Should return model info.

### Test 3: Chatbot Integration
```powershell
.\venv\Scripts\python.exe test_chatbot.py
```

Should show AI responses to test questions.

### Test 4: Browser
Open `http://localhost:8080`, click chat icon, send a message!

## ⚠️ Troubleshooting

### "I couldn't connect to the local AI assistant"

**Check 1: Is the server running?**
- Look at LM Studio's Local Server tab
- Should say "Server running on http://localhost:1234"
- If not, click "Start Server"

**Check 2: Is a model loaded?**
- Go to Chat tab
- Top should show loaded model name
- If not, load a model first

**Check 3: Port conflict?**
```powershell
netstat -ano | findstr :1234
```
If something else is using port 1234, stop it or change LM Studio's port.

### "Response is too slow"

**Solution 1: Use GPU**
- Settings → Enable GPU acceleration
- Requires NVIDIA GPU with CUDA

**Solution 2: Smaller model**
- Use Q4_K_M instead of Q8_0
- Or try Phi-3-mini (smaller, faster)

**Solution 3: Reduce context**
- Settings → Context Length → 2048

### "Model not downloading"

**Solution 1: Check internet**
- Models are 3-7GB, need stable connection

**Solution 2: Free disk space**
- Need at least 10GB free

**Solution 3: Try different mirror**
- Some models have multiple sources

### "Out of memory" error

**Solution 1: Use smaller quantization**
- Q4_K_M instead of Q8_0

**Solution 2: Close other apps**
- Free up RAM

**Solution 3: Smaller model**
- Try Phi-3-mini or LLaMA 3.2 3B

### LM Studio not opening

**Solution:**
1. Check Task Manager, kill any old LM Studio processes
2. Restart your computer
3. Reinstall LM Studio
4. Download from official site only

## 🎨 Example Conversations

### Example 1: Watering Decision
```
You: Should I water my crops?

AI: Based on your current conditions - temperature 28.5°C, 
humidity 65%, and soil moisture at 45% - your crops have 
adequate water. Muskmelons typically need watering when 
soil moisture drops below 40%. I recommend checking again 
in 3-4 hours.
```

### Example 2: Fertilizer Advice
```
You: What fertilizer should I add?

AI: Looking at your NPK values (N=90, P=42, K=43), your 
nitrogen is excellent. However, Muskmelons benefit from 
higher phosphorus. I recommend adding DAP (Diammonium 
Phosphate) at 50kg per acre to boost P levels to 50-60.
```

### Example 3: Temperature Query
```
You: Is 28°C too hot?

AI: At 28.5°C, your temperature is ideal for Muskmelon 
cultivation. Muskmelons thrive between 25-35°C. However, 
maintain good soil moisture to prevent heat stress during 
peak afternoon hours.
```

## 💡 Pro Tips

### Tip 1: Keep Server Running
Leave LM Studio open with server running. It responds faster to subsequent requests.

### Tip 2: Monitor Performance
Watch tokens/second in LM Studio. Should be 15-30+ for good experience.

### Tip 3: Try Different Models
Download multiple models and switch between them to find your favorite.

### Tip 4: Adjust Temperature
- **0.5** - Conservative, factual responses
- **0.7** - Balanced (default)
- **0.9** - Creative, varied responses

### Tip 5: Use System Prompts
In LM Studio Chat, set a system prompt like:
```
You are an agricultural expert assistant.
```

### Tip 6: GPU Acceleration
If you have an NVIDIA GPU, enable GPU acceleration for 3-5x faster responses!

## 🔒 Privacy & Security

- ✅ **100% Local** - Everything runs on your computer
- ✅ **No Internet Required** - Works offline after model download
- ✅ **No Data Collection** - Your data stays on your machine
- ✅ **No API Keys** - No subscriptions or external services
- ✅ **Open Source Models** - LLaMA, Mistral, etc. are open source

## 📈 Performance Expectations

### On Modern PC (16GB RAM, good CPU):
- **First Response:** 5-10 seconds (model warm-up)
- **Subsequent:** 2-4 seconds
- **Tokens/sec:** 20-40

### On Older PC (8GB RAM):
- **First Response:** 10-15 seconds
- **Subsequent:** 4-8 seconds
- **Tokens/sec:** 10-20

### With GPU (NVIDIA RTX):
- **First Response:** 2-3 seconds
- **Subsequent:** 1-2 seconds
- **Tokens/sec:** 50-100+

## 🚀 Next Steps

Once working:
1. ✅ Try different models in LM Studio
2. ✅ Adjust temperature for better responses
3. ✅ Connect ESP32 for real sensor data
4. ✅ Ask diverse questions to test AI knowledge
5. ✅ Share your experience with the community!

## 📚 Additional Resources

- **LM Studio Website:** https://lmstudio.ai
- **LM Studio Discord:** https://discord.gg/lmstudio
- **Model Hub:** https://huggingface.co/TheBloke
- **Documentation:** https://lmstudio.ai/docs

## 🆚 LM Studio vs Ollama

| Feature | LM Studio | Ollama |
|---------|-----------|--------|
| Interface | ✅ GUI | ❌ CLI only |
| Easy Setup | ✅ Very easy | ⚡ Moderate |
| Model Download | ✅ One-click | ⚡ Command line |
| Visual Progress | ✅ Yes | ❌ No |
| Testing Chat | ✅ Built-in | ⚡ Terminal only |
| Server Status | ✅ Visual | ⚡ Hidden |
| Model Switching | ✅ Instant | ⚡ Requires pull |
| GPU Support | ✅ Easy toggle | ✅ Auto-detect |

**Winner:** LM Studio for beginners! 🏆

## ✅ Success Checklist

You'll know it's working when:

1. ✅ LM Studio shows "Model loaded"
2. ✅ Server shows "Running on http://localhost:1234"
3. ✅ Flask server starts without errors
4. ✅ Frontend opens at http://localhost:8080
5. ✅ Chat icon appears bottom-right
6. ✅ Typing message shows spinner
7. ✅ AI responds with agricultural advice
8. ✅ Response mentions your sensor values

## 🎉 You're All Set!

Your AgroSmart chatbot is now powered by a local AI running on LM Studio!

**Advantages:**
- No API costs
- Complete privacy
- Works offline
- Easy to use
- Visual interface

**Happy farming with AI assistance!** 🌱🤖

---

*Need help? Check LM Studio's Discord or the LMSTUDIO_TROUBLESHOOTING.md file.*

*Last updated: November 2025*
