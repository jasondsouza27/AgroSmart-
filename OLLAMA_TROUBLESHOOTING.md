# 🔧 Ollama Download Issues - Solutions

## Your Issue
You're getting a "TLS handshake timeout" error when trying to download the model. This is common with large downloads or network issues.

## Solutions (Try in Order)

### Solution 1: Use a Smaller, Faster Model (RECOMMENDED)
Instead of `llama3.2:3b`, try the smaller `phi3:mini` model:

```powershell
ollama pull phi3:mini
```

**Benefits:**
- ✅ Much smaller download (~2GB vs 2GB)
- ✅ Faster download time
- ✅ Faster responses
- ✅ Less RAM usage (4GB vs 8GB)
- ✅ Still very capable for agricultural advice

**After downloading, update the model name:**
Edit `prediction_server.py` around line 216:
```python
"model": "phi3:mini",  # Changed from llama3.2:3b
```

### Solution 2: Retry with Better Network
Sometimes it's just a temporary network issue:

```powershell
# Try again
ollama pull llama3.2:3b

# Or try with verbose output to see progress
ollama pull llama3.2:3b -v
```

### Solution 3: Check Your Internet Connection
```powershell
# Test connectivity to Ollama registry
ping registry.ollama.ai

# Check if you can reach the site
curl https://ollama.com
```

**Common causes:**
- Slow internet connection
- Firewall blocking Ollama
- Antivirus interfering with download
- VPN issues

### Solution 4: Configure Proxy (If Behind Corporate Network)
If you're behind a corporate firewall or proxy:

```powershell
# Set proxy environment variables
$env:HTTP_PROXY="http://your-proxy:port"
$env:HTTPS_PROXY="http://your-proxy:port"

# Then try pulling
ollama pull phi3:mini
```

### Solution 5: Try Different Models (Smallest to Largest)

**1. Tiny Model (Fastest Download):**
```powershell
ollama pull tinyllama
```
- Size: ~637MB
- RAM: 2GB
- Speed: Very fast
- Quality: Basic but functional

**2. Small Model (Recommended):**
```powershell
ollama pull phi3:mini
```
- Size: ~2.3GB
- RAM: 4GB
- Speed: Fast
- Quality: Good for most tasks

**3. Medium Model (If you have good internet):**
```powershell
ollama pull llama3.2:1b
```
- Size: ~1.3GB
- RAM: 4GB
- Speed: Fast
- Quality: Better than tinyllama

**4. Original Model (If download succeeds):**
```powershell
ollama pull llama3.2:3b
```
- Size: ~2GB
- RAM: 8GB
- Speed: Medium
- Quality: Best

### Solution 6: Restart Ollama Service
Sometimes Ollama needs a restart:

```powershell
# Close Ollama from Task Manager (Ctrl+Shift+Esc)
# Or kill the process
taskkill /F /IM ollama.exe

# Start Ollama again from Start menu
# Then try pulling
ollama pull phi3:mini
```

### Solution 7: Reinstall Ollama
If nothing works, try reinstalling:

1. Download fresh installer from https://ollama.com/download
2. Run installer
3. Restart your computer
4. Try pulling a small model first: `ollama pull phi3:mini`

## ⚡ Quick Fix - Use Phi3 Mini NOW!

The fastest way to get started:

```powershell
# 1. Pull the smaller model
ollama pull phi3:mini

# 2. Wait for download to complete

# 3. Verify it worked
ollama list
```

You should see:
```
NAME        ID          SIZE    MODIFIED
phi3:mini   abc123...   2.3GB   X minutes ago
```

**4. Update your code:**

Edit `c:\Users\Jason Dsouza\Desktop\crop_project\prediction_server.py` line 216:

Change from:
```python
"model": "llama3.2:3b",
```

To:
```python
"model": "phi3:mini",
```

**5. Restart Flask server:**
```powershell
# Stop current server (Ctrl+C in terminal)
# Start again
.\venv\Scripts\python.exe prediction_server.py
```

**6. Test the chatbot!** Open http://localhost:8080 and chat.

## 🔍 Diagnostic Commands

Check if Ollama is running:
```powershell
# Check process
Get-Process ollama

# Check service status
ollama --version

# List models
ollama list

# Check connectivity
Test-NetConnection registry.ollama.ai -Port 443
```

## 📊 Model Comparison for Your Decision

| Model | Download Size | RAM | Speed | Quality | Recommendation |
|-------|--------------|-----|-------|---------|----------------|
| tinyllama | 637MB | 2GB | ⚡⚡⚡⚡ | ⭐⭐ | Testing only |
| llama3.2:1b | 1.3GB | 4GB | ⚡⚡⚡ | ⭐⭐⭐ | Good balance |
| phi3:mini | 2.3GB | 4GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | **BEST CHOICE** |
| llama3.2:3b | 2GB | 8GB | ⚡⚡ | ⭐⭐⭐⭐ | If download works |

## 🎯 My Recommendation

**Use `phi3:mini` - here's why:**

✅ **Easier to download** - Similar size but often downloads faster
✅ **Great quality** - Microsoft's model, excellent for Q&A
✅ **Less RAM** - Works on 4GB RAM systems
✅ **Faster responses** - You'll get answers quicker
✅ **Agricultural knowledge** - Well-trained on various topics including agriculture

## 🚀 After Model is Downloaded

Once you have ANY model working:

```powershell
# 1. Verify
ollama list

# 2. Test it
ollama run phi3:mini "What is the best crop for high humidity?"

# 3. Update prediction_server.py with the model name you downloaded

# 4. Restart Flask server

# 5. Test chatbot in browser
```

## 💡 Network Tips

If downloads keep timing out:

1. **Download during off-peak hours** (late night/early morning)
2. **Use wired connection** instead of WiFi if possible
3. **Disable VPN** temporarily
4. **Check antivirus** - it might be blocking
5. **Check Windows Firewall** settings
6. **Try mobile hotspot** if home internet is slow

## 🆘 Still Having Issues?

If all else fails, you can:

1. **Use the chatbot with mock responses** (it will work, just won't be AI-powered)
2. **Try downloading on a different network** (friend's house, coffee shop)
3. **Use a download manager** to resume if interrupted
4. **Ask someone with better internet** to download and share the model file

## 📝 Alternative: Keep Mock Responses Temporarily

If you can't get Ollama working right now, the chatbot will still function with helpful error messages guiding users. You can work on other features and come back to this later.

The system is designed to handle Ollama not being available gracefully!

## ✅ Success Check

You'll know it's working when:

```powershell
PS C:\Users\Jason Dsouza> ollama list
NAME        ID          SIZE    MODIFIED
phi3:mini   abc123...   2.3GB   2 minutes ago

PS C:\Users\Jason Dsouza> ollama run phi3:mini "Hello"
Hello! How can I help you today?
```

---

**TL;DR: Use `ollama pull phi3:mini` instead - it's faster, smaller, and works great!**

Need more help? Check the error messages in your terminal or Flask logs for specific issues.
