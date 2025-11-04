# 🤖 AgroSmart AI Chatbot

## What's New?

Your AgroSmart dashboard now includes an intelligent AI-powered chatbot that provides real-time agricultural advice based on your sensor data!

### ✨ Features

- **🌱 Context-Aware**: Knows your current farm conditions (temperature, humidity, soil moisture, NPK values)
- **🎯 Crop-Specific**: Understands the recommended crop for your conditions
- **🔒 100% Private**: Runs completely on your local machine - no data sent to external servers
- **💬 Natural Conversation**: Ask questions in plain English
- **⚡ Real-Time**: Uses live sensor data for accurate recommendations

## 🚀 Quick Start

### 1. Install LM Studio (One-time setup)

**All Platforms (Windows/Mac/Linux):**
1. Download from [https://lmstudio.ai](https://lmstudio.ai)
2. Install and open LM Studio
3. Click **🔍 Search** icon → Search for `llama-2-7b-chat`
4. Download **TheBloke/Llama-2-7B-Chat-GGUF** (Q4_K_M recommended)
5. Go to **💬 Chat** tab → Load the model
6. Click **↔ Local Server** → Start Server (port 1234)

### 2. Verify Installation
- LM Studio should show "Server running on http://localhost:1234"
- Test in Chat tab by sending a message
- If AI responds, you're all set!

### 3. Start Your AgroSmart System

**Terminal 1 - Backend:**
```powershell
.\venv\Scripts\python.exe prediction_server.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### 4. Use the Chatbot

1. Open your dashboard at `http://localhost:8080`
2. Click the floating chat icon (bottom-right corner)
3. Ask questions about your crops!

## 💬 Example Conversations

### Example 1: Watering Decision
```
You: Should I water my crops right now?

Bot: Based on your current soil moisture of 45% and humidity 
at 65%, your crops have adequate water. I recommend waiting 
until soil moisture drops below 40% before the next irrigation.
```

### Example 2: Fertilizer Advice
```
You: What fertilizer should I use?

Bot: Your NPK levels show N=90, P=42, K=43. For Muskmelon 
cultivation, consider adding phosphorus-rich fertilizer to 
boost P levels to 50-60. Use DAP (Diammonium Phosphate) at 
50kg per acre.
```

### Example 3: Temperature Concerns
```
You: Is 28°C too hot for my crops?

Bot: At 28.5°C, your temperature is ideal for Muskmelon 
cultivation. Muskmelons thrive in 25-35°C range. However, 
ensure adequate soil moisture to prevent heat stress.
```

## 🎨 What Changed?

### Backend (`prediction_server.py`)
**New endpoint:** `/api/chat` (POST)
- Accepts user messages and sensor context
- Calls local Ollama API
- Returns AI-generated agricultural advice

### Frontend (`ChatBot.tsx`)
**Updated component:**
- ✅ Removed mock responses
- ✅ Added API integration
- ✅ Added loading states
- ✅ Added error handling
- ✅ Accepts sensor context as props
- ✅ Shows spinner while AI thinks

### Dashboard Integration
**Updated:** `Dashboard.tsx`
- Now passes real-time sensor data to ChatBot
- Includes recommended crop in context
- Updates context every 5 seconds

## 🔧 Technical Details

### Architecture
```
User Input → Frontend ChatBot → Flask /api/chat → LM Studio API → AI Model → Response
                                       ↓
                               Sensor Context
                               (Temp, Humidity, etc.)
```

### API Request Format
```json
POST /api/chat
{
  "message": "Should I water my crops?",
  "context": {
    "temperature": 28.5,
    "humidity": 65,
    "soil_moisture": 45,
    "N": 90,
    "P": 42,
    "K": 43,
    "recommended_crop": "Muskmelon"
  }
}
```

### API Response Format
```json
{
  "response": "Based on your soil moisture of 45%..."
}
```

## 🛠️ Configuration

### Change AI Model (in LM Studio)
1. Download different model from Search tab
2. Go to Chat tab
3. Click model dropdown at top
4. Select new model
5. No code changes needed!

**Recommended models:**
- **LLaMA 2 7B Chat** - Balanced, great for conversations (4GB RAM)
- **Mistral 7B Instruct** - Excellent quality (4GB RAM)
- **Phi-3-mini** - Fast, lightweight (2GB RAM)
- **LLaMA 3.2 3B** - Latest from Meta (2GB RAM)

### Adjust Response Length
Edit `prediction_server.py` (line ~223):
```python
"max_tokens": 200,  # Increase for longer responses (200-500)
```

### Creativity Level
Edit `prediction_server.py` (line ~222):
```python
"temperature": 0.7,  # 0.5 = conservative, 0.9 = creative
```

Or adjust in LM Studio's Chat interface (slider at top).

## 🧪 Testing

Run the test script to verify everything works:
```powershell
.\venv\Scripts\python.exe test_chatbot.py
```

Expected output:
```
🤖 AgroSmart Chatbot Test
==================================================
Testing endpoint: http://localhost:5000/api/chat

[Test 1] User: Should I water my crops right now?
--------------------------------------------------
✅ Bot: Based on your soil moisture of 45%...
```

## ⚠️ Troubleshooting

### "I couldn't connect to the local AI assistant"

**Check LM Studio:**
1. Open LM Studio
2. Go to **↔ Local Server** tab
3. Check if it says "Server running on http://localhost:1234"
4. If not, click **Start Server**

**Check Model:**
1. Go to **💬 Chat** tab
2. Top should show loaded model name
3. If blank, click model dropdown and load a model

### "Request timeout"

**Solution 1: Use faster model**
In LM Studio:
- Download **Phi-3-mini** (smaller, faster)
- Or use **Q4_K_M** quantization instead of Q8_0

**Solution 2: Increase timeout**
Edit `prediction_server.py` (line ~227):
```python
response = requests.post(lmstudio_url, json=lmstudio_payload, timeout=60)  # Increase from 30
```

### High CPU/RAM usage

This is normal when AI generates responses.

**Solutions:**
- In LM Studio Settings: Enable GPU acceleration (if you have NVIDIA GPU)
- Use smaller model (Q4_K_M instead of Q8_0)
- Close other applications
- Reduce max_tokens in code

### "Model not found" in LM Studio

**Solution:**
1. Click **🔍 Search** icon
2. Search for "llama-2-7b-chat"
3. Download **TheBloke/Llama-2-7B-Chat-GGUF**
4. Choose **Q4_K_M** quantization
5. Wait for download
6. Load in Chat tab

### Frontend errors

**Check browser console:**
1. Open Developer Tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests

**Common fix:**
Restart Flask server and frontend.

## 📊 System Requirements

| Model | RAM | Disk | Speed | Quality |
|-------|-----|------|-------|---------|
| Phi-3-mini (Q4) | 4GB | 2GB | ⚡⚡⚡⚡ | ⭐⭐⭐ |
| LLaMA 2 7B (Q4_K_M) | 6GB | 4GB | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| Mistral 7B (Q4_K_M) | 6GB | 4GB | ⚡⚡⚡ | ⭐⭐⭐⭐ |
| LLaMA 2 7B (Q8_0) | 8GB | 7GB | ⚡⚡ | ⭐⭐⭐⭐⭐ |

**Note:** With GPU acceleration (NVIDIA), speed increases 3-5x!

## 🔒 Privacy & Security

- ✅ **100% Local**: All processing on your machine
- ✅ **No Internet Required**: Works offline (after model download)
- ✅ **No Data Collection**: Your sensor data never leaves your system
- ✅ **No API Keys**: No external services or subscriptions
- ✅ **Open Source**: Ollama and models are open source

## 🎯 Best Practices

### Ask Specific Questions
❌ Bad: "Help"
✅ Good: "Should I water my crops given the current soil moisture?"

### Provide Context (if needed)
❌ Bad: "What about rice?"
✅ Good: "Can I grow rice with my current NPK levels?"

### Follow-up Questions
The chatbot remembers context within the conversation, so you can ask follow-up questions.

## 📚 Additional Resources

- **LM Studio Website**: https://lmstudio.ai
- **LM Studio Discord**: https://discord.gg/lmstudio
- **Model Hub**: https://huggingface.co/TheBloke
- **AgroSmart Setup Guide**: See `LMSTUDIO_SETUP.md`
- **Test Script**: Run `test_chatbot.py`

## 🚀 What's Next?

Future enhancements planned:
- 📝 Conversation history persistence
- 🌍 Multi-language support
- 📊 Historical data analysis
- 🔔 Proactive alerts and recommendations
- 🎤 Voice input support

## 💡 Tips

1. **First Response Slow?** The first response after starting LM Studio can be slow as it loads the model into memory. Subsequent responses are faster.

2. **Model Selection:** Start with **LLaMA 2 7B (Q4_K_M)** - it's the best balance of speed and quality.

3. **GPU Boost:** If you have an NVIDIA GPU, enable GPU acceleration in LM Studio settings for 3-5x faster responses!

4. **Sensor Context:** The AI is smarter when your ESP32 is connected and providing real sensor data.

5. **Experiment:** Try different questions to discover what the AI can help with! LM Studio makes it easy to switch models.

## 🤝 Contributing

Have ideas for improving the chatbot? Found a bug? Feel free to open an issue or contribute!

---

**Happy farming with AI assistance!** 🌱🤖

*Last updated: January 2025*
