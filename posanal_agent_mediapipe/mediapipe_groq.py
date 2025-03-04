#@markdown To better demonstrate the Pose Landmarker API, we have created a set of visualization tools that will be used in this script. These will draw the landmarks on a detect person, as well as the expected connections between those markers.

import cv2
import mediapipe as mp
import numpy as np

import requests
import json

from dotenv import load_dotenv
import os

load_dotenv()



# Function to process images/video and get landmarks (x,y,z) coordinates and visibility
def process_image(image):
    # Initialize MediaPipe Holistic model
    mp_holistic = mp.solutions.holistic
    mp_drawing = mp.solutions.drawing_utils
    holistic = mp_holistic.Holistic(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5)
    # Convert BGR to RGB
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Process the image and extract landmarks
    results = holistic.process(image_rgb)
    
    # Extract pose landmarks
    if results.pose_landmarks:
        pose_landmarks = []
        for landmark in results.pose_landmarks.landmark:
            # Get x, y, z coordinates and visibility
            pose_landmarks.append({
                'x': landmark.x,
                'y': landmark.y,
                'z': landmark.z,
                'visibility': landmark.visibility
            })
        return pose_landmarks
    return None


def identify_yoga_pose(pose_landmarks):
    # Groq API endpoint
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    
    # API key (replace with your actual key)
    api_key =  os.getenv("GROQ_API_KEY") # Replace this
    
    # Format landmarks into a compact readable format
    landmark_text = "Body keypoints (x, y, z coordinates):\n"
    for i, lm in enumerate(pose_landmarks):
        landmark_text += f"Point {i}: ({lm['x']:.3f}, {lm['y']:.3f}, {lm['z']:.3f})\n"
    
    # Create the messages
    messages = [
        {"role": "system", "content": "You are an expert in yoga pose analysis."},
        {"role": "user", "content": f"""
        Analyze these human pose landmarks and identify which yoga pose it represents.
        
        {landmark_text}
        
        Based on these coordinates, identify if this is one of the following yoga poses:
        - Downward Dog
        - Plank
        - Warrior I
        - Warrior II
        - Tree Pose
        - Child's Pose
        
        Explain your reasoning based on the relative positions of key joints.
        """}
    ]
    
    # Prepare the API request
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.2-90b-vision-preview",
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 500
    }
    
    # For debugging
    print("Sending request to Groq API...")
    
    # Make the API request
    try:
        response = requests.post(api_url, headers=headers, json=payload, timeout=60)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
             result = response.json()
             print(f"Status Code: {response.status_code}")
             print(result["choices"][0]["message"]["content"])
             return result["choices"][0]["message"]["content"]       
        else:
            print(f"Error Response: {response.text}")
            return f"Error: {response.status_code}, {response.text}"
    except Exception as e:
        print(f"Exception: {str(e)}")
        return f"Exception occurred: {str(e)}"

# Run the test
if __name__ == "__main__":
    image = cv2.imread('images//test-dog.jpg')
    landmarks = process_image(image)
    identify_yoga_pose(landmarks)