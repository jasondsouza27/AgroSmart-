# AgroSmart Chatbot - Local LLM Setup Guide

## Overview
The AgroSmart chatbot now uses a locally running Large Language Model (LLM) through Ollama, providing intelligent agricultural advice based on your real-time sensor data.

## Prerequisites
- Windows 10/11
- At least 8GB RAM (16GB recommended)
- 4GB free disk space

## Installation Steps

### 1. Download and Install Ollama
1. Visit [ollama.com](https://ollama.com/download)
2. Download the Windows installer
3. Run the installer (it will install to your system)
4. Ollama runs automatically after installation in the background

### 2. Pull the AI Model
Open PowerShell or Command Prompt and run:
```powershell
ollama pull llama3.2:3b
```

This downloads the Llama 3.2 3B model (~2GB). It's lightweight and fast, perfect for agricultural advice.

**Alternative Models (Optional):**
- For better responses (but slower): `ollama pull llama3.2`
- For faster responses: `ollama pull phi3:mini`

### 3. Verify Installation
Check if Ollama is running:
```powershell
ollama list
```

You should see `llama3.2:3b` in the list.

### 4. Test the Model
Try a quick test:
```powershell
ollama run llama3.2:3b "What is the best crop for high humidity?"
```

If you get a response, you're all set!

## Using the Chatbot

### Starting the System
1. **Start Flask server:**
   ```powershell
   .\venv\Scripts\python.exe prediction_server.py
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Ollama runs automatically** - no need to start it manually!

### Chat Features
- **Context-Aware**: The AI knows your current sensor readings (temperature, humidity, soil moisture, NPK values)
- **Crop-Specific**: Aware of the recommended crop for your conditions
- **Agricultural Expertise**: Trained to provide farming advice
- **Real-Time**: Responds based on live data from your farm

### Example Questions
- "Should I water my crops right now?"
- "What fertilizer do you recommend for rice?"
- "Is the current temperature good for my crops?"
- "How can I improve my soil moisture?"
- "What's the best time to plant tomatoes?"

## Troubleshooting

### "I couldn't connect to the local AI assistant"
**Solution:**
1. Check if Ollama is running:
   ```powershell
   ollama list
   ```
2. If not running, restart your computer (Ollama auto-starts)
3. Or manually start: Run "Ollama" from Windows Start menu

### "Model not found" error
**Solution:**
Pull the model again:
```powershell
ollama pull llama3.2:3b
```

### Slow responses
**Solutions:**
1. Use a smaller model:
   ```powershell
   ollama pull phi3:mini
   ```
2. Update `prediction_server.py` line 216:
   ```python
   "model": "phi3:mini",  # Instead of llama3.2:3b
   ```

### High CPU/RAM usage
Ollama uses system resources when generating responses. This is normal. Close other applications if needed.

## Configuration

### Change the AI Model
Edit `prediction_server.py` around line 216:
```python
ollama_payload = {
    "model": "llama3.2:3b",  # Change this
    ...
}
```

### Adjust Response Length
In `prediction_server.py` around line 220:
```python
"num_predict": 200  # Increase for longer responses (200-500)
```

### Temperature (Creativity)
In `prediction_server.py` around line 219:
```python
"temperature": 0.7  # 0.5 = more focused, 0.9 = more creative
```

## API Endpoint Details

### `/api/chat` (POST)
**Request:**
```json
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

**Response:**
```json
{
  "response": "Based on your current soil moisture of 45% and humidity of 65%, your crops have adequate water. I recommend waiting until soil moisture drops below 40% before irrigating again..."
}
```

## System Requirements by Model

| Model | RAM | Disk Space | Speed | Quality |
|-------|-----|------------|-------|---------|
| phi3:mini | 4GB | 2GB | Fast | Good |
| llama3.2:3b | 8GB | 2GB | Medium | Better |
| llama3.2 | 16GB | 4GB | Slow | Best |

## Privacy & Security
- **100% Local**: All AI processing happens on your computer
- **No Internet Required**: After model download, works offline
- **Private**: Your sensor data never leaves your system
- **No API Keys**: No external services or subscriptions needed

## Support
If you encounter issues:
1. Check Ollama status: `ollama list`
2. View Flask logs for error messages
3. Restart Ollama: Close from Task Manager, reopen from Start menu
4. Reinstall model: `ollama pull llama3.2:3b`

## Next Steps
- Try different questions in the chatbot
- Experiment with different AI models
- Adjust response settings for your preference
- Connect your ESP32 for real-time sensor data integration

Happy farming with AI assistance! 🌱🤖
