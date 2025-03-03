import os
import base64
import json
import time
import pygame  # Using pygame for audio playback
import errno
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize pygame mixer at the start
pygame.mixer.init()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Function to select appropriate sound based on posture analysis
def select_sound_file(analysis_text):
    # Define keywords to look for in the analysis
    if "excellent" in analysis_text.lower() or "very good" in analysis_text.lower():
        return "assets/wonderful_posture.wav"
    elif "good" in analysis_text.lower():
        return "assets/wonderful_posture.wav"
    elif "slouching" in analysis_text.lower() or "forward head" in analysis_text.lower():
        return "assets/stop_slouching.wav"
    elif "leaning" in analysis_text.lower():
        return "assets/stop_slouching.wav"
    elif "rounded shoulders" in analysis_text.lower():
        return "assets/stop_slouching.wav"
    #else:
        # Default sound if no specific condition is detected
        #return "assets/check_posture.wav"

def encode_image(image_path):
    while True:
        try:
            with open(image_path, "rb") as image_file:
                return base64.b64encode(image_file.read()).decode("utf-8")
        except IOError as e:
            if e.errno != errno.EACCES:
                # Not a "file in use" error, re-raise
                raise
            # File is being written to, wait a bit and retry
            time.sleep(0.1)

def play_audio_file(file_path):
    try:
        sound = pygame.mixer.Sound(file_path)
        sound.play()
        # Wait for the sound to finish playing
        pygame.time.wait(int(sound.get_length() * 1000))
    except Exception as e:
        print(f"Error playing audio: {e}")

def analyze_image(base64_image, script):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
{
                    "role": "system",
                    "content": (
                        "You are a posture analysis expert specializing in ergonomics and "
                        "biomechanics. Analyze the image for the following aspects: "
                        "1. Head position (forward head posture) "
                        "2. Shoulder alignment (rounded or elevated shoulders) "
                        "3. Spine curvature (excessive kyphosis or lordosis) "
                        "4. Pelvic tilt (anterior or posterior) "
                        "5. Knee alignment "
                        "6. Overall body balance and weight distribution "
                        "Provide specific observations, identify potential issues, and suggest "
                        "corrective exercises or adjustments."
                    )
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Analyze the posture in this image and provide detailed feedback:"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
        ],
        max_tokens=300,
    )
    response_text = response.choices[0].message.content
    return response_text

def main():
    script = []

    # Ensure assets directory exists
    if not os.path.exists("assets"):
        print("Warning: assets directory not found. Please create it and add sound files.")
        os.makedirs("assets", exist_ok=True)

    while True:
        # path to your image
        image_path = os.path.join(os.getcwd(), "./frames/frame.jpg")

        # getting the base64 encoding
        base64_image = encode_image(image_path)

        # analyze posture
        print("👀 Slouch bot is watching...")
        analysis = analyze_image(base64_image, script=script)

        print("🎙️ Slouch bot says:")
        print(analysis)

        # Select and play appropriate sound
        sound_file = select_sound_file(analysis)
        if os.path.exists(sound_file):
            play_audio_file(sound_file)
        else:
            print(f"Warning: Sound file {sound_file} not found!")

        script = script + [{"role": "assistant", "content": analysis}]

        # wait for 5 seconds
        time.sleep(5)

if __name__ == "__main__":
    main()