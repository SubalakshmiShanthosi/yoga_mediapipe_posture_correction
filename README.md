# Hackathon - 2025

Women General Health and Wellness

Frontend - UI + Yoga Pose Detection Implementation Integration
Integrated Mediapipe for landmark detection - mediapipe posture landmarks (33 landmark points) - 0 to 10 (face), 11-22 (upper body), 23-32 (lower body) 
Model build for specific yoga poses show confidence and class label (pose name) while during the yoga pose and have timer to detect how long(timer) the correct posture is maintained.

To Run Pose detection module - clone repository, cd frontend, npm install and select yoga postures from dropdown. 
After clicking button to start pose - webcam integration should be allowed and pose estimation run in background over webcam capture. 

With the  normalized landmarks and pose confidence probabilty from the model -  Gen AI prompt call to be made with landmark coordinates to llama-3.2-90b-vision-preview (Groq) for understanding the correction to be done 
based on it's reasoning to give feedback  by assessing relative positions of key joints, along with additional information from MoveNet model prediction probability.

