import joblib
import pandas as pd
from flask import Flask, request, jsonify

# --- 1. Initialize the Flask App ---
# Flask is a lightweight framework for building web applications and APIs in Python.
app = Flask(__name__)

# --- 2. Load the Trained Model ---
# This line loads the model you trained and saved earlier.
# The script expects 'crop_recommendation_model.joblib' to be in the same folder.
print("Loading the machine learning model...")
try:
    model = joblib.load('crop_recommendation_model.joblib')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Error: 'crop_recommendation_model.joblib' not found. Make sure the model file is in the same directory.")
    model = None
except Exception as e:
    print(f"An error occurred while loading the model: {e}")
    model = None

# --- 3. Define the Prediction Logic ---
def make_prediction(data):
    """
    Takes sensor and API data, formats it, and returns a crop prediction
    and a pump control command.
    """
    if model is None:
        return "Model not loaded", "Error"

    # The model expects specific column names. Create a DataFrame from the input data.
    # The feature order must match the training data: ['N', 'P', 'K', 'temperature', 'humidity', 'rainfall']
    try:
        feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'rainfall']
        df = pd.DataFrame([data], columns=feature_columns)

        # Use the model to predict the crop
        crop_prediction = model.predict(df)[0]

        # --- Simple Pump Control Logic ---
        # This is a basic rule-based system.
        # You can create more complex rules for different crops.
        # For now, we use a universal threshold for soil moisture.
        pump_command = "PUMP_OFF"
        soil_moisture = data.get('soil_moisture', 100) # Use a default if not provided
        
        # Turn on the pump if soil moisture is below 40%
        if soil_moisture < 40:
            pump_command = "PUMP_ON"
        
        print(f"Prediction successful. Recommended Crop: {crop_prediction}, Pump Command: {pump_command}")
        return crop_prediction, pump_command

    except Exception as e:
        print(f"Error during prediction: {e}")
        return "Prediction Error", "Error"

# --- 4. Create an API Endpoint ---
# This sets up a URL (e.g., http://your-pc-ip:5000/predict) that the ESP32 will send data to.
# It only accepts POST requests, which is standard for sending data.
@app.route('/predict', methods=['POST'])
def predict():
    """
    Receives data from the ESP32, makes a prediction, and returns the result.
    """
    print("\nReceived a request on /predict")
    # Get the JSON data sent by the ESP32
    data = request.get_json()

    if not data:
        print("Error: No data received.")
        return jsonify({"error": "No input data provided"}), 400

    print("Data received from ESP32:", data)
    
    # Call our prediction function
    crop, pump_action = make_prediction(data)
    
    # Return the results to the ESP32 in JSON format
    return jsonify({
        'recommended_crop': crop,
        'pump_command': pump_action
    })

# --- 5. Run the Server ---
# This starts the server when you run 'python prediction_server.py'
if __name__ == '__main__':
    # '0.0.0.0' makes the server accessible from any device on your local network (like your ESP32).
    # 'port=5000' is the standard port for Flask apps.
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000)
