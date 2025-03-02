# Getting started with Mediapipe Pose detection

Step 1 - Dataset collection and resources  used for this project - 
    Dataset for yoga posture - Yoga 82 dataset https://sites.google.com/view/yoga-82/home
    Working on data collection scripts - colab -- save on drive for 83 different types of asanas

Step 2 - Utilizing HuggingFace Space - https://huggingface.co/spaces/AleNunezArroyo/pose-detection-mediapipe model build with google mediapipe for detecting the posture and getting line joint drawing
                    
Step 3 - Visualizing landmarks for a yoga pose
    To run this script

    1. Ensure conda virtual environment is set and using (make sure the vscode terminal type - cmd)
    2. Install required packages - pip install -r requirements.txt
    3. Run demo_mediapipe.py

Next steps: 
    Step 1 - Run landmark generation on live stream of images
    Step 2 - Work on classification for 5 different asanas landmark and classification algorithm on the detected variation - wrong vs right posture
