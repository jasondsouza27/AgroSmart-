import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os # Import the os module to check for file existence

# --- 1. Data Loading and Preparation ---

# The full, absolute path to the local dataset file you downloaded.
# Using a raw string (r"...") is the best practice for Windows paths.
DATASET_FILENAME = r"C:\Users\Jason Dsouza\Desktop\crop_project\Crop_recommendation.csv"

def load_and_prepare_data(filename):
    """
    Loads the dataset from a local CSV file, removes the 'ph' column,
    and separates features (X) from the target variable (y).
    """
    print(f"Loading dataset from '{filename}'...")

    # Check if the file exists before trying to read it
    if not os.path.exists(filename):
        print(f"Error: The file '{filename}' was not found.")
        print("Please download the dataset and place it in the same directory as this script.")
        return None, None

    try:
        df = pd.read_csv(filename)
        print("Dataset loaded successfully.")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        return None, None

    # As requested, remove the 'ph' column from the dataset
    print("Dropping the 'ph' column...")
    df = df.drop('ph', axis=1)

    # Separate the features (inputs) from the target (output)
    # X contains all columns except 'label'
    # y contains only the 'label' column (the crop name)
    X = df.drop('label', axis=1)
    y = df['label']

    print("Data preparation complete.")
    print("\nFeatures (X) sample:")
    print(X.head())
    print("\nTarget (y) sample:")
    print(y.head())

    return X, y

# --- 2. Model Training and Evaluation ---

def train_and_evaluate_model(X, y):
    """
    Splits the data, trains a RandomForestClassifier,
    and evaluates its performance.
    """
    # Split the data into training (80%) and testing (20%) sets
    # random_state ensures that the split is the same every time you run the script
    print("\nSplitting data into training and testing sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training set size: {X_train.shape[0]} samples")
    print(f"Testing set size: {X_test.shape[0]} samples")

    # Initialize the Random Forest Classifier
    # n_estimators is the number of trees in the forest.
    print("\nInitializing the Random Forest model...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)

    # Train the model using the training data
    print("Training the model... (This may take a moment)")
    model.fit(X_train, y_train)
    print("Model training complete.")

    # Make predictions on the test data
    print("\nMaking predictions on the test set...")
    y_pred = model.predict(X_test)

    # Calculate the accuracy of the model
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

    return model

# --- 3. Save the Model and Demonstrate Prediction ---

def save_model(model, filename):
    """
    Saves the trained model to a file using joblib.
    """
    print(f"\nSaving the trained model to '{filename}'...")
    try:
        joblib.dump(model, filename)
        print("Model saved successfully.")
    except Exception as e:
        print(f"Error saving model: {e}")


def demonstrate_prediction(model, feature_columns):
    """
    Shows how to use the trained model to make a prediction
    with sample sensor and API data.
    """
    print("\n--- Prediction Demonstration ---")
    # Example data representing live sensor readings and API data
    # [N, P, K, temperature, humidity, rainfall]
    sample_data = [[90, 42, 43, 20.8, 82.0, 202.9]]

    # Convert the sample data into a pandas DataFrame with the correct column names
    # This is crucial because the model expects the input in this format
    sample_df = pd.DataFrame(sample_data, columns=feature_columns)

    print("\nSample Input Data:")
    print(sample_df)

    # Use the trained model to predict the crop
    prediction = model.predict(sample_df)

    print(f"\nPredicted suitable crop: {prediction[0]}")
    print("---------------------------------")


# --- Main Execution ---
if __name__ == "__main__":
    # Step 1: Load and prepare the data from the local file
    X, y = load_and_prepare_data(DATASET_FILENAME)

    if X is not None and y is not None:
        # Step 2: Train the model
        trained_model = train_and_evaluate_model(X, y)

        # Step 3: Save the model for later use
        MODEL_FILENAME = 'crop_recommendation_model.joblib'
        save_model(trained_model, MODEL_FILENAME)

        # Step 4: Demonstrate how to make a prediction
        # We pass X.columns to ensure the sample DataFrame has the correct feature names
        demonstrate_prediction(trained_model, X.columns)


