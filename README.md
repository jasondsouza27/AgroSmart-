# Smart Agriculture and Crop Recommendation System

## Introduction

This project is a system for monitoring agricultural conditions and providing intelligent recommendations. It integrates hardware sensors with a web-based dashboard to collect real-time data on soil moisture, temperature, and humidity. This data is used to automate irrigation and to power a machine learning model that suggests suitable crops for the current environmental conditions.

The system is designed to assist in making data-driven decisions for farming, aiming to optimize water usage and improve crop selection.

## Core Features

*   **Real-Time Monitoring**: Displays live data from connected environmental sensors on the dashboard.
*   **Automated Irrigation**: Activates a water pump automatically based on configurable soil moisture thresholds.
*   **Manual Pump Control**: Allows users to start or stop the pump directly from the dashboard interface.
*   **Crop Recommendation**: Utilizes a machine learning model to recommend crops based on sensor data and environmental parameters.
*   **Historical Data Analysis**: Logs sensor readings over time, presents them in charts, and allows for data export to CSV format.
*   **Weather Integration**: Fetches and displays current weather data for a specified location.
*   **User Authentication**: Secures access to the dashboard through a user login and registration system.
*   **AI Chatbot**: Provides an interface to a locally run large language model for agricultural queries and also gets feeded the censor data.

## System Architecture

The system consists of three main components:

1.  **IoT Device (ESP32)**: Reads data from the soil moisture and temperature/humidity sensors. It controls the water pump via a relay and sends all data to the backend server over a serial connection.
2.  **Backend Server (Flask)**: A Python-based server that communicates with the ESP32. It processes sensor data, runs the crop prediction model, serves the REST API, and handles user requests from the frontend.
3.  **Frontend Application (React)**: A web-based dashboard that provides the user interface. It visualizes sensor data, displays recommendations, and allows for interaction with the system controls.

## Technology Stack

### Hardware
*   **Microcontroller**: ESP32
*   **Sensors**: Capacitive Soil Moisture Sensor, DHT11 (Temperature & Humidity)
*   **Actuator**: 5V Relay Module, Mini Water Pump

### Backend
*   **Framework**: Flask
*   **Language**: Python
*   **Machine Learning**: Scikit-learn, Pandas, NumPy
*   **Serial Communication**: PySerial
*   **API**: REST

### Frontend
*   **Framework**: React.js with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui
*   **Data Fetching**: React Query
*   **Charts**: Recharts

### Authentication
*   **Service**: Firebase Authentication (Email/Password, Google)

### External Services
*   **Weather Data**: WeatherAPI.com
*   **AI Chatbot**: Locally hosted model via LM Studio

## Setup and Installation

### Prerequisites
*   Python 3.8+
*   Node.js 18+
*   PlatformIO or Arduino IDE for flashing the ESP32
*   A configured Firebase project for authentication
*   An API key from WeatherAPI.com

### 1. Backend Setup
```bash
# Navigate to the project root directory
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file in the root and add your environment variables
# ESP32_PORT=COM5
# WEATHER_API_KEY=your_weather_api_key

# Run the Flask server
python prediction_server.py
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Create a .env.local file in the frontend directory
# Add your Firebase configuration variables
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... and so on for all required Firebase keys

# Run the frontend development server
npm run dev
```

### 3. Hardware Setup
1.  Connect the sensors (DHT11, Soil Moisture) and the relay module to the appropriate GPIO pins on the ESP32 as defined in the firmware source code.
2.  Open the `esp32_firmware` project in PlatformIO or Arduino IDE.
3.  Configure the Wi-Fi credentials if needed (currently not used for data transfer).
4.  Compile and upload the firmware to the ESP32 board.

## Usage

1.  Ensure the ESP32 is connected to the computer running the backend server.
2.  Start the backend server. It will automatically try to connect to the ESP32.
3.  Start the frontend server.
4.  Open a web browser and navigate to `http://localhost:8080` (or the port specified by Vite).
5.  Register a new account or log in.
6.  The dashboard will display real-time sensor data, weather information, and crop recommendations. Use the pump control card to manage irrigation.
```// filepath: c:\Users\Jason Dsouza\Desktop\crop_project\README.md
# Smart Agriculture and Crop Recommendation System

## Introduction

This project is a system for monitoring agricultural conditions and providing intelligent recommendations. It integrates hardware sensors with a web-based dashboard to collect real-time data on soil moisture, temperature, and humidity. This data is used to automate irrigation and to power a machine learning model that suggests suitable crops for the current environmental conditions.

The system is designed to assist in making data-driven decisions for farming, aiming to optimize water usage and improve crop selection.

## Core Features

*   **Real-Time Monitoring**: Displays live data from connected environmental sensors on the dashboard.
*   **Automated Irrigation**: Activates a water pump automatically based on configurable soil moisture thresholds.
*   **Manual Pump Control**: Allows users to start or stop the pump directly from the dashboard interface.
*   **Crop Recommendation**: Utilizes a machine learning model to recommend crops based on sensor data and environmental parameters.
*   **Historical Data Analysis**: Logs sensor readings over time, presents them in charts, and allows for data export to CSV format.
*   **Weather Integration**: Fetches and displays current weather data for a specified location.
*   **User Authentication**: Secures access to the dashboard through a user login and registration system.
*   **AI Chatbot**: Provides an interface to a locally run large language model for agricultural queries.

## System Architecture

The system consists of three main components:

1.  **IoT Device (ESP32)**: Reads data from the soil moisture and temperature/humidity sensors. It controls the water pump via a relay and sends all data to the backend server over a serial connection.
2.  **Backend Server (Flask)**: A Python-based server that communicates with the ESP32. It processes sensor data, runs the crop prediction model, serves the REST API, and handles user requests from the frontend.
3.  **Frontend Application (React)**: A web-based dashboard that provides the user interface. It visualizes sensor data, displays recommendations, and allows for interaction with the system controls.

## Technology Stack

### Hardware
*   **Microcontroller**: ESP32
*   **Sensors**: Capacitive Soil Moisture Sensor, DHT11 (Temperature & Humidity)
*   **Actuator**: 5V Relay Module, Mini Water Pump

### Backend
*   **Framework**: Flask
*   **Language**: Python
*   **Machine Learning**: Scikit-learn, Pandas, NumPy
*   **Serial Communication**: PySerial
*   **API**: REST

### Frontend
*   **Framework**: React.js with TypeScript
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui
*   **Data Fetching**: React Query
*   **Charts**: Recharts

### Authentication
*   **Service**: Firebase Authentication (Email/Password, Google)

### External Services
*   **Weather Data**: WeatherAPI.com
*   **AI Chatbot**: Locally hosted model via LM Studio

## Setup and Installation

### Prerequisites
*   Python 3.8+
*   Node.js 18+
*   PlatformIO or Arduino IDE for flashing the ESP32
*   A configured Firebase project for authentication
*   An API key from WeatherAPI.com

### 1. Backend Setup
```bash
# Navigate to the project root directory
# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create a .env file in the root and add your environment variables
# ESP32_PORT=COM5
# WEATHER_API_KEY=your_weather_api_key

# Run the Flask server
python prediction_server.py
```

### 2. Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Create a .env.local file in the frontend directory
# Add your Firebase configuration variables
# VITE_FIREBASE_API_KEY=your_api_key
# VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... and so on for all required Firebase keys

# Run the frontend development server
npm run dev
```

### 3. Hardware Setup
1.  Connect the sensors (DHT11, Soil Moisture) and the relay module to the appropriate GPIO pins on the ESP32 as defined in the firmware source code.
2.  Open the `esp32_firmware` project in PlatformIO or Arduino IDE.
3.  Configure the Wi-Fi credentials if needed (currently not used for data transfer).
4.  Compile and upload the firmware to the ESP32 board.

## Usage

1.  Ensure the ESP32 is connected to the computer running the backend server.
2.  Start the backend server. It will automatically try to connect to the ESP32.
3.  Start the frontend server.
4.  Open a web browser and navigate to `http://localhost:8080` (or the port specified by Vite).
5.  Register a new account or log in.
6.  The dashboard will display real-time sensor data, weather information, and crop recommendations. Use the pump control card to manage irrigation.
