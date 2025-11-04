"""
COM Port Detector for ESP32
Helps you find which COM port your ESP32 is connected to
"""

import serial.tools.list_ports

def list_com_ports():
    """
    List all available COM ports with details
    """
    ports = serial.tools.list_ports.comports()
    
    if not ports:
        print("No COM ports found!")
        print("\nMake sure:")
        print("1. ESP32 is connected via USB")
        print("2. USB drivers are installed")
        print("3. Try a different USB cable or port")
        return None
    
    print("\n" + "=" * 60)
    print("Available COM Ports:")
    print("=" * 60)
    
    esp32_ports = []
    
    for i, port in enumerate(ports, 1):
        print(f"\n{i}. Port: {port.device}")
        print(f"   Description: {port.description}")
        print(f"   Hardware ID: {port.hwid}")
        
        # Check if it might be an ESP32
        if any(keyword in port.description.lower() for keyword in ['usb', 'serial', 'cp210', 'ch340', 'esp']):
            print(f"   >>> Likely ESP32 <<<")
            esp32_ports.append(port.device)
    
    print("\n" + "=" * 60)
    
    if esp32_ports:
        print(f"\nRecommended Port(s): {', '.join(esp32_ports)}")
        return esp32_ports[0]
    else:
        return ports[0].device if ports else None

def test_com_port(port):
    """
    Test if a COM port works with ESP32
    """
    print(f"\nTesting {port}...")
    try:
        ser = serial.Serial(port, 115200, timeout=2)
        print(f"✓ Successfully opened {port}")
        print("  Listening for ESP32 data (5 seconds)...")
        
        import time
        start_time = time.time()
        while time.time() - start_time < 5:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if line:
                    print(f"  Data received: {line[:80]}")
        
        ser.close()
        print(f"✓ {port} is working!")
        return True
    except Exception as e:
        print(f"✗ Error testing {port}: {e}")
        return False

if __name__ == '__main__':
    print("ESP32 COM Port Detector")
    recommended_port = list_com_ports()
    
    if recommended_port:
        print(f"\n\nUpdate local_data_collector.py with:")
        print(f"  SERIAL_PORT = '{recommended_port}'")
        
        response = input(f"\nTest this port? (y/n): ")
        if response.lower() == 'y':
            test_com_port(recommended_port)
