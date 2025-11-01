import joblib
import pandas as pd

# --- 1. Load the Saved Model ---
print("Loading the trained model...")
try:
    model = joblib.load('crop_recommendation_model.joblib')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("Error: 'crop_recommendation_model.joblib' not found. Make sure you are in the right folder.")
    exit()

# --- 2. Define Sample Data for Testing ---
# Let's create a few scenarios to see what the model predicts.
# Each list represents: [N, P, K, temperature, humidity, rainfall]

# Scenario 1: High NPK, good conditions for rice
data_for_rice = [[90, 42, 43, 20.8, 82.0, 202.9]] 

# Scenario 2: Conditions suitable for apples
data_for_apple = [[21, 130, 200, 22.6, 92.3, 115.5]]

# Scenario 3: Your own custom data. Change these values!
your_custom_data = [[104, 18, 30, 23.6, 60.3, 140.9]] # Example for Jute

# The model expects the column names in a specific order.
feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'rainfall']

# --- 3. Make and Print Predictions ---

print("\n--- Making Predictions ---")

# Test Case 1: Rice
df_rice = pd.DataFrame(data_for_rice, columns=feature_columns)
prediction_rice = model.predict(df_rice)
print(f"Input Data (Rice): {data_for_rice[0]}")
print(f"Predicted Crop: {prediction_rice[0]}")

# Test Case 2: Apple
print("-" * 20)
df_apple = pd.DataFrame(data_for_apple, columns=feature_columns)
prediction_apple = model.predict(df_apple)
print(f"Input Data (Apple): {data_for_apple[0]}")
print(f"Predicted Crop: {prediction_apple[0]}")

# Test Case 3: Your Data
print("-" * 20)
df_custom = pd.DataFrame(your_custom_data, columns=feature_columns)
prediction_custom = model.predict(df_custom)
print(f"Input Data (Custom): {your_custom_data[0]}")
print(f"Predicted Crop: {prediction_custom[0]}")
