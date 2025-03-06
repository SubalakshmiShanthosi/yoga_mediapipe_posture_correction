export const poseInstructions = {
    Tree: [
        'Begin in Mountain Pose (Tadasana).',
        'Ensuring both feet are firmly grounded and weight is evenly distributed for balance. Bend one leg at the knee, starting with your chosen leg (e.g., right leg). If your left leg is the standing leg, bend your right leg at the knee and place the sole of your right foot against the left inner thigh, creating a half-lotus position.',
        'Point the bent knee outward, away from your body. Lengthen your torso and join your hands in Anjali Mudra (prayer position).',
        'Hold the pose, breathing deeply, and when ready, exhale, return to Mountain Pose, and repeat with the opposite leg.'
        ],
    Cobra: [
        'Lie prone on the floor with legs stretched back, tops of the feet on the ground, and hands placed under the shoulders. Hug your elbows back into your body.',
        'On an inhale, straighten your arms to lift your chest off the floor, ensuring you only lift as high as you can maintain a connection between your pubis and legs. Press your tailbone toward the pubis and lift the pubis toward the navel',
        'firming the buttocks without hardening them. Pull your shoulder blades back, puffing your side ribs forward, and lift through the sternum.', 
        'maintaining an even backbend. Hold for 15 to 30 seconds, breathing easily, then exhale to release.'
    ],
    Dog: [
        'Start on your hands and knees, with your hands slightly in front of your shoulders and knees directly below your hips. Spread your palms, rooting through all four corners of your hands, and turn your toes under.',
        'Exhale, lifting your knees off the floor, keeping them slightly bent and heels lifted. Lengthen your tailbone away from your pelvis, lift your sitting bones, and draw your inner legs from your ankles through your groins. ',
        'On an exhale, push your thighs back, stretching your heels toward the floor, straightening your knees without locking them.',
        'Firm your outer arms, press your index fingers into the floor, and lift your inner arms.',
        'Keep your head between your upper arms. Stay for 10+ breaths, then lower to Childs Pose.'
    ],
    Chair: [
        'Stand straight and tall with your feet slightly wider than hip­-width apart and your arms at your sides.',
        'Inhale and lift your arms next to your ears, stretching them straight and parallel with wrists and fingers long. Keep your shoulders down and spine neutral.',
        'Exhale as you bend your knees, keeping your thighs and knees parallel. Lean your torso forward to create a right angle with the tops of your thighs. Keep your neck and head in line with your torso and arms. Hold for 30 seconds to 1 minute.',
    ],
    Warrior: [
        'Start in a lunge with a bent front knee, back leg straight, and back heel lifted. Keep your hips and chest squared to the front. Raise your arms overhead.',
        'Bring your palms together in prayer position at your heart and lean forward, extending your back leg straight, keeping your foot flexed and gaze downward.',
        'Ensure your standing leg is strong and straight without locking the knee.',
        'Reach your arms forward, forming a “T” shape. Hold the position.'
    ],
    Traingle: [
        'Stand with feet wide apart, turning your left foot out and bending the left leg. Raise your arms into a “T” shape.',
        'Straighten the left leg, hinge at the hips, and reach your torso over your left leg. Rotate your left palm up and gaze over your left arm.',
        'Reach your left hand to the mat, place it in front of your foot, and extend your right arm overhead. If you lose balance, bring your back leg closer.',
        'Hold and repeat on the other side.'
    ],
    Shoulderstand: [
        'Begin by stacking two folded blankets on the mat and laying down with your shoulders aligned on them. Bend your legs, feet on the floor, and walk your shoulders under your upper back, lifting your chest gently.',
        'Lift your hips into a bridge pose, then press into your palms to lift onto the balls of your feet.',
        'Extend one leg up, bend at the elbows, and support your lower back with your hands.',
        'Raise the second leg and align your body so hips are over shoulders and feet over hips.',
        'Hold for up to 10 breaths.'
    ]
    
}



export const tutorials = [
    '1. When App ask for permission of camera, allow it to access to capture pose.',
    '2. Select what pose you want to do in the dropdown.',
    '3. Read Instrctions of that pose so you will know how to do that pose.',
    '4. Click on Start pose and see the image of the that pose in the right side and replecate that image in front of camera.',
    '5. If you will do correctly the skeleton over the video will become green in color and sound will start playing'
]

export const fixCamera = [
    'Solution 1. Make sure you have allowed the permission of camera, if you have denined the permission, go to setting of your browser to allow the access of camera to the application.',
    'Solution 2. Make sure no any other application is not accessing camera at that time, if yes, close that application',
    'Solution 3. Try to close all the other opened broswers'
] 

export const POINTS = {
    NOSE : 0,
    LEFT_EYE : 1,
    RIGHT_EYE : 2,
    LEFT_EAR : 3,
    RIGHT_EAR : 4,
    LEFT_SHOULDER : 5,
    RIGHT_SHOULDER : 6,
    LEFT_ELBOW : 7,
    RIGHT_ELBOW : 8,
    LEFT_WRIST : 9,
    RIGHT_WRIST : 10,
    LEFT_HIP : 11,
    RIGHT_HIP : 12,
    LEFT_KNEE : 13,
    RIGHT_KNEE : 14,
    LEFT_ANKLE : 15,
    RIGHT_ANKLE : 16,
}

export const keypointConnections = {
    nose: ['left_ear', 'right_ear'],
    left_ear: ['left_shoulder'],
    right_ear: ['right_shoulder'],
    left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
    right_shoulder: ['right_elbow', 'right_hip'],
    left_elbow: ['left_wrist'],
    right_elbow: ['right_wrist'],
    left_hip: ['left_knee', 'right_hip'],
    right_hip: ['right_knee'],
    left_knee: ['left_ankle'],
    right_knee: ['right_ankle']
}