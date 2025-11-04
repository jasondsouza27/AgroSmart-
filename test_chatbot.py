"""
Test script for AgroSmart Chatbot with Local LLM
This script tests if the chat endpoint works correctly
"""

import requests
import json

# API endpoint
API_URL = "http://localhost:5000/api/chat"

# Test context (simulated sensor data)
test_context = {
    "temperature": 28.5,
    "humidity": 65,
    "soil_moisture": 45,
    "N": 90,
    "P": 42,
    "K": 43,
    "recommended_crop": "Muskmelon"
}

# Test messages
test_messages = [
    "Should I water my crops right now?",
    "What fertilizer do you recommend?",
    "Is the temperature good for my crops?",
]

print("🤖 AgroSmart Chatbot Test\n" + "="*50)
print(f"Testing endpoint: {API_URL}")
print(f"Sensor context: {json.dumps(test_context, indent=2)}\n")

for i, message in enumerate(test_messages, 1):
    print(f"\n[Test {i}] User: {message}")
    print("-" * 50)
    
    try:
        # Send request
        response = requests.post(
            API_URL,
            json={
                "message": message,
                "context": test_context
            },
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Bot: {data.get('response', 'No response')}")
        else:
            print(f"❌ Error {response.status_code}: {response.json()}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection error: Make sure Flask server is running")
        print("   Run: .\\venv\\Scripts\\python.exe prediction_server.py")
        break
    except requests.exceptions.Timeout:
        print("⏱️ Request timed out - Ollama might be slow or not responding")
    except Exception as e:
        print(f"❌ Unexpected error: {str(e)}")

print("\n" + "="*50)
print("\n💡 Tips:")
print("1. Make sure Flask server is running on port 5000")
print("2. Install LM Studio: https://lmstudio.ai")
print("3. Download LLaMA 2 7B model in LM Studio")
print("4. Load model and start server (port 1234)")
print("5. LM Studio has a nice GUI - much easier than command line!")
