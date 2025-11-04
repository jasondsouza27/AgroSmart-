# 🚀 Quick Start: LM Studio + AgroSmart Chatbot

## 30-Second Setup

### 1. Download LM Studio
👉 **https://lmstudio.ai** → Click Download → Install

### 2. Get LLaMA 2 Model
In LM Studio:
- Click **🔍 Search**
- Type: `llama-2-7b-chat`
- Download: **TheBloke/Llama-2-7B-Chat-GGUF**
- Choose: **Q4_K_M** (recommended)

### 3. Start the AI
- Click **💬 Chat** tab
- Load your downloaded model
- Click **↔ Local Server** tab
- Click **Start Server** (green button)

### 4. Run AgroSmart
```powershell
# Terminal 1 - Backend
cd C:\Users\Jason Dsouza\Desktop\crop_project
.\venv\Scripts\python.exe prediction_server.py

# Terminal 2 - Frontend
cd C:\Users\Jason Dsouza\Desktop\crop_project\frontend
npm run dev
```

### 5. Chat!
Open `http://localhost:8080` → Click chat icon → Ask questions!

---

## ✅ Checklist

- [ ] LM Studio installed
- [ ] LLaMA 2 7B downloaded
- [ ] Model loaded in Chat tab
- [ ] Server running (port 1234)
- [ ] Flask backend started (port 5000)
- [ ] Frontend running (port 8080)
- [ ] Chatbot responding!

---

## 🎯 Test Questions

Try these in your chatbot:
- "Should I water my crops right now?"
- "What fertilizer do you recommend?"
- "Is the temperature good for my crops?"
- "How can I improve soil moisture?"

---

## ⚡ Why LM Studio?

✅ **Easy** - Beautiful GUI, no commands
✅ **Visual** - See everything happening
✅ **Fast** - GPU acceleration built-in
✅ **Free** - No API costs
✅ **Private** - 100% local

---

## 🆘 Problems?

### Server won't start?
- Check if port 1234 is free
- Restart LM Studio
- Try loading model again

### No AI response?
- Is Flask running? Check terminal
- Is LM Studio server green?
- Is a model loaded?

### Too slow?
- Enable GPU in Settings (if NVIDIA GPU)
- Use Q4_K_M model (not Q8_0)
- Close other apps

---

## 📖 More Help

- **Full Guide:** `LMSTUDIO_SETUP.md`
- **Features:** `CHATBOT_README.md`
- **Test:** Run `test_chatbot.py`

---

**That's it! You now have an AI agricultural assistant running locally!** 🌱🤖
