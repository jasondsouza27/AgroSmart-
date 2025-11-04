// API configuration - Updated for USB Serial Bridge
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface SensorData {
  temperature: number;
  humidity: number;
  soil_moisture: number;
  N: number;
  P: number;
  K: number;
  rainfall?: number;
  recommended_crop?: string;
  pump_command?: string;
  timestamp?: string;
}

export interface PumpStatus {
  active: boolean;
  last_updated: string | null;
}

export interface BridgeResponse {
  sensor_data: {
    temperature: number;
    humidity: number;
    soil_moisture: number;
    timestamp: string;
  };
  prediction: {
    crop: string;
    confidence: number;
    timestamp: string;
  };
  status: {
    connection: string;
    pump: string;
    timestamp: string;
  };
}

// Fetch current sensor readings from bridge
export async function getCurrentSensors(): Promise<SensorData> {
  try {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
      throw new Error('Failed to fetch sensor data');
    }
    const data: BridgeResponse = await response.json();
    
    // Transform bridge data to match SensorData interface
    return {
      temperature: data.sensor_data.temperature,
      humidity: data.sensor_data.humidity,
      soil_moisture: data.sensor_data.soil_moisture,
      N: 50,
      P: 50,
      K: 50,
      rainfall: 100,
      recommended_crop: data.prediction.crop !== 'Unknown' ? data.prediction.crop : undefined,
      timestamp: data.sensor_data.timestamp,
    };
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return {
      temperature: 25,
      humidity: 60,
      soil_moisture: 45,
      N: 50,
      P: 50,
      K: 50,
      rainfall: 100,
      timestamp: new Date().toISOString(),
    };
  }
}

// Fetch sensor history
export async function getSensorHistory(limit: number = 24): Promise<SensorData[]> {
  try {
    const current = await getCurrentSensors();
    return [current];
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    return [];
  }
}

// Get pump status from bridge
export async function getPumpStatus(): Promise<PumpStatus> {
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error('Failed to fetch pump status');
    }
    const data = await response.json();
    
    return {
      active: data.pump === 'ON',
      last_updated: data.timestamp,
    };
  } catch (error) {
    console.error('Error fetching pump status:', error);
    return {
      active: false,
      last_updated: null,
    };
  }
}

// Control pump via bridge
export async function controlPump(command: 'PUMP_ON' | 'PUMP_OFF'): Promise<any> {
  try {
    const action = command === 'PUMP_ON' ? 'ON' : 'OFF';
    const response = await fetch(`${API_BASE_URL}/pump/${action}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to control pump');
    }
    return response.json();
  } catch (error) {
    console.error('Error controlling pump:', error);
    throw error;
  }
}

// Get prediction from bridge
export async function getPrediction(data: Partial<SensorData>): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/prediction`);
    if (!response.ok) {
      throw new Error('Failed to get prediction');
    }
    return response.json();
  } catch (error) {
    console.error('Error getting prediction:', error);
    return {
      crop: 'Unknown',
      confidence: 0,
    };
  }
}
