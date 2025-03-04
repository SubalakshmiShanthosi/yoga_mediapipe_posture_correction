# Yoga Posture Estimation and Suggesting correction

Prompt outline for analyzing mediapipe posture landmarks (33 landmark points) - 0 to 10 (face), 11-22 (upper body), 23-32 (lower body)

LLM model with vision capabilities - open source - llama-3.2-90b-vision-preview
API hit limits per minute 15 calls (free tier eligible)

Work in progress  -

    Model fine-tuning on landmark coordinates created for test/ train/ images - correct/ incorrect/ based on posture 
    (custom landmark classifier) (Considered yoga postures - Downdog, tree pose, upward plank, vajrasana, warrior_1, warrior_2)

    Work on creating confidence score
    for the pose detected from webcam for the subset of asanas (correct/incorrect results out of model)

    Alter prompt for llama vision to work on model predicition and score created to suggest correct of posture

Webcam to Groq call changes (call API every 30 seconds) 