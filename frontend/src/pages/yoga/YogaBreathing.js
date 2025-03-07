import React, { useEffect, useRef, useState } from 'react';
import { Entity, Scene } from 'aframe-react';
import * as tmImage from '@teachablemachine/image';
import './aframe.css';
import './rStats.css';
import './breath.css';

const YogaBreathing = () => {
  const webcamContainerRef = useRef(null);
  const labelContainerRef = useRef(null);
  const breathRingRef = useRef(null);
  const sceneRef = useRef(null);

  const [breathState, setBreathState] = useState('Waiting...');
  const [breathRate, setBreathRate] = useState('-- breaths/min');
  const [progressWidth, setProgressWidth] = useState(0);
  const [binauralEnabled, setBinauralEnabled] = useState(false);
  const [ringScale, setRingScale] = useState({ x: 1, y: 1, z: 1 });
  const [ringColor, setRingColor] = useState('#FFFFFF');

  // State for tracking breathing
  const breathingData = useRef({
    lastBreathState: '',
    breathCount: 0,
    lastBreathTime: Date.now(),
    breathingRates: [],
    model: null,
    webcam: null,
    maxPredictions: 0,
    defaultScale: { x: 1, y: 1, z: 1 },
    maxScale: { x: 1.5, y: 1.5, z: 1.5 },
    minScale: { x: 0.8, y: 0.8, z: 0.8 }
  });
  
  const sounds = useRef({
    ambient: null,
    inhale: null,
    exhale: null,
    binaural: null
  });

  // Load the Teachable Machine model
  const loadModel = async () => {
    const URL = "https://teachablemachine.withgoogle.com/models/gzyLzkqwr/";
    try {
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      // Load the model
      const model = await tmImage.load(modelURL, metadataURL);
      breathingData.current.model = model;
      breathingData.current.maxPredictions = model.getTotalClasses();

      // Set up webcam
      const flip = true;
      const webcam = new tmImage.Webcam(160, 120, flip);
      await webcam.setup();
      await webcam.play();
      breathingData.current.webcam = webcam;

      if (webcamContainerRef.current) {
        webcamContainerRef.current.appendChild(webcam.canvas);
      }

      // Create prediction labels
      if (labelContainerRef.current) {
        for (let i = 0; i < breathingData.current.maxPredictions; i++) {
          labelContainerRef.current.appendChild(document.createElement("div"));
        }
      }

      // Start the prediction loop
      window.requestAnimationFrame(loop);

      // Start ambient sound
      if (sounds.current.ambient) {
        sounds.current.ambient.play();
      }
    } catch (error) {
      console.error("Error initializing model:", error);
      setBreathState("Error: Could not load breathing model");
    }
  };

  // Prediction loop
  const loop = async () => {
    if (breathingData.current.webcam) {
      breathingData.current.webcam.update();
      await predict();
      window.requestAnimationFrame(loop);
    }
  };

  // Make predictions from webcam feed
  const predict = async () => {
    if (!breathingData.current.model || !breathingData.current.webcam) return;

    // Get model predictions
    const prediction = await breathingData.current.model.predict(breathingData.current.webcam.canvas);
    let highestProb = 0;
    let currentBreathingState = '';

    // Process all predictions
    for (let i = 0; i < breathingData.current.maxPredictions; i++) {
      const probability = prediction[i].probability.toFixed(2);
      const className = prediction[i].className;
      const classPrediction = className + ": " + probability;

      // Update label container (for debugging)
      if (labelContainerRef.current && labelContainerRef.current.childNodes[i]) {
        labelContainerRef.current.childNodes[i].innerHTML = classPrediction;
      }

      // Track highest probability state
      if (prediction[i].probability > highestProb) {
        highestProb = prediction[i].probability;
        currentBreathingState = className;
      }
    }

    // Only accept predictions with high confidence
    if (highestProb < 0.6) {
      currentBreathingState = "Neutral";
    }

    // Update UI state
    setBreathState(currentBreathingState);
    setProgressWidth(highestProb * 100);

    // Handle breath state changes and count breaths
    if (currentBreathingState !== breathingData.current.lastBreathState && highestProb > 0.7) {
      // Handle state transition
      if (currentBreathingState === "Inhale") {
        playSound('inhale');
        const now = Date.now();

        // Only count full breath cycles
        if (breathingData.current.lastBreathState === "Exhale") {
          breathingData.current.breathCount++;

          // Calculate breathing rate
          const breathDuration = (now - breathingData.current.lastBreathTime) / 1000; // in seconds
          if (breathDuration > 0.5 && breathDuration < 10) {
            // Filter unrealistic values
            breathingData.current.breathingRates.push(60 / breathDuration); // Breaths per minute

            // Use last 5 breaths for average
            if (breathingData.current.breathingRates.length > 5) {
              breathingData.current.breathingRates.shift();
            }

            const avgRate =
              breathingData.current.breathingRates.reduce((sum, rate) => sum + rate, 0) /
              breathingData.current.breathingRates.length;
            
            setBreathRate(avgRate.toFixed(1) + " breaths/min");
          }

          breathingData.current.lastBreathTime = now;
        }
      } else if (currentBreathingState === "Exhale") {
        playSound('exhale');
      }
    }

    // Update the breathing visualizer in A-Frame
    updateBreathingVisualizer(currentBreathingState, highestProb);

    breathingData.current.lastBreathState = currentBreathingState;
  };

  // Update A-Frame visualization
  const updateBreathingVisualizer = (state, intensity) => {
    if (!breathRingRef.current) return;

    // Clamp intensity between 0 and 1
    intensity = Math.max(0, Math.min(1, intensity));

    //const ring = document.querySelector('#breath-ring');
    //if (!ring) return;

    if (state === "Inhale") {
      // Scale up during inhale
      const scale = {
        x: breathingData.current.defaultScale.x + (breathingData.current.maxScale.x - breathingData.current.defaultScale.x) * intensity,
        y: breathingData.current.defaultScale.y + (breathingData.current.maxScale.y - breathingData.current.defaultScale.y) * intensity,
        z: breathingData.current.defaultScale.z + (breathingData.current.maxScale.z - breathingData.current.defaultScale.z) * intensity
      };
      setRingScale(scale);
      setRingColor('#64FFDA');
    } else if (state === "Exhale") {
      // Scale down during exhale
      const scale = {
        x: breathingData.current.defaultScale.x - (breathingData.current.defaultScale.x - breathingData.current.minScale.x) * intensity,
        y: breathingData.current.defaultScale.y - (breathingData.current.defaultScale.y - breathingData.current.minScale.y) * intensity,
        z: breathingData.current.defaultScale.z - (breathingData.current.defaultScale.z - breathingData.current.minScale.z) * intensity
      };
      setRingScale(scale);
      setRingColor('#FF9E80');
    } else {
      // Reset to default for neutral
      setRingScale(breathingData.current.defaultScale);
      setRingColor('#FFFFFF');
    }
  };

  // Helper function to play sound effects
  const playSound = (soundId) => {
    if (sounds.current[soundId]) {
      sounds.current[soundId].currentTime = 0;
      sounds.current[soundId].play();
    }
  };

  // Toggle binaural beats
  const toggleBinauralBeats = () => {
    if (binauralEnabled) {
      if (sounds.current.binaural) {
        sounds.current.binaural.volume = 0;
      }
      setBinauralEnabled(false);
    } else {
      if (sounds.current.binaural) {
        sounds.current.binaural.volume = 0.3;
        sounds.current.binaural.play();
      }
      setBinauralEnabled(true);
    }
  };

  // Setup gaze-based interaction for A-Frame elements
  const setupGazeInteraction = () => {
    // Add A-Frame components
    if (!window.AFRAME.components['gaze-based-trigger']) {
        window.AFRAME.registerComponent('gaze-based-trigger', {
        init: function () {
          const cursor = document.getElementById("cursor");
          
          this.el.addEventListener("mouseenter", () => {
            if (cursor) cursor.setAttribute("color", "#FF4081");
            
            // Increase binaural beats when focusing on meditation stone
            if (binauralEnabled && this.el.id === "meditation-stone") {
              if (sounds.current.binaural) {
                sounds.current.binaural.volume = 1.0;
              }
            }
          });
          
          this.el.addEventListener("mouseleave", () => {
            if (cursor) cursor.setAttribute("color", "#FFFFFF");
            
            // Decrease binaural beats when not focusing
            if (binauralEnabled && this.el.id === "meditation-stone") {
              if (sounds.current.binaural) {
                sounds.current.binaural.volume = 0.3;
              }
            }
          });
        }
      });
    }

    // Apply component to elements
    setTimeout(() => {
      const meditationStone = document.getElementById("meditation-stone");
      const water = document.getElementById("water");
      const breathingCircle = document.getElementById("breathing-circle");
      
      if (meditationStone) meditationStone.setAttribute("gaze-based-trigger", "");
      if (water) water.setAttribute("gaze-based-trigger", "");
      if (breathingCircle) breathingCircle.setAttribute("gaze-based-trigger", "");
    }, 1000);
  };

  // Initialize audio elements
  const initAudio = () => {
    sounds.current = {
      ambient: new Audio("https://cdn.pixabay.com/audio/2021/09/06/audio_887337c364.mp3"),
      inhale: new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_dc7f6cbf40.mp3"),
      exhale: new Audio("https://cdn.pixabay.com/audio/2022/03/18/audio_22b9122b9d.mp3"),
      binaural: new Audio("https://cdn.pixabay.com/audio/2023/09/06/audio_9156365c45.mp3")
    };

    // Configure audio properties
    sounds.current.ambient.loop = true;
    sounds.current.ambient.volume = 0.5;
    sounds.current.inhale.volume = 0.8;
    sounds.current.exhale.volume = 0.8;
    sounds.current.binaural.loop = true;
    sounds.current.binaural.volume = 0;
  };

  // Effect for initialization
  useEffect(() => {
    initAudio();
    
    // Wait for A-Frame to initialize before setting up components
    const sceneLoaded = () => {
      setupGazeInteraction();
      loadModel();
    };
    
    const sceneEl = document.querySelector('a-scene');
    if (sceneEl) {
      sceneEl.addEventListener('loaded', sceneLoaded);
    }

    
    return () => {
      // Cleanup
      if (breathingData.current.webcam) {
        breathingData.current.webcam.stop();
      }
      
      Object.values(sounds.current).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
      
      if (sceneEl) {
        sceneEl.removeEventListener('loaded', sceneLoaded);
      }
    };
  }, []);

  return (
    <div className="yoga-breathing-app">
      <Scene embedded>
        {/* Sky background */}
        <Entity primitive="a-sky" color="#AADDF0" />
        {/* Environment */}
        <Entity primitive="a-plane" position="0 0 0" rotation="-90 0 0" width="20" height="20" color="#7BC8A4" />

        {/* Meditation environment */}
        <Entity id="meditation-environment">
          {/* Trees */}
          <Entity position="-5 0 -5">
            <Entity primitive="a-cone" position="0 1.5 0" color="#2E7D32" height="3" radius-bottom="1" radius-top="0" />
            <Entity primitive="a-cylinder" position="0 0 0" color="#795548" height="1" radius="0.2" />
          </Entity>
          <Entity position="5 0 -5">
            <Entity primitive="a-cone" position="0 1.5 0" color="#2E7D32" height="3" radius-bottom="1" radius-top="0" />
            <Entity primitive="a-cylinder" position="0 0 0" color="#795548" height="1" radius="0.2" />
        </Entity>

        {/* Water body */}
        <Entity id="water" position="0 0.05 -3">
            <Entity primitive="a-circle" position="0 0 0" rotation="-90 0 0" radius="3" color="#64B5F6" opacity="0.8" />
            <Entity primitive="a-ring" position="0 0 0" rotation="-90 0 0" radius-inner="3" radius-outer="3.2" color="#29B6F6" />
        </Entity>
          {/* Meditation stone */}
        <Entity id="meditation-stone" position="0 0.1 -3">
          <Entity
            primitive="a-torus-knot"
            color="#B39DDB"
            arc="360"
            p="2"
            q="3"
            radius="0.5"
            radius-tubular="0.05"
            position="0 1 0"
          >
            <Entity
              primitive="a-animation"
              attribute="rotation"
              dur="10000"
              to="0 360 0"
              repeat="indefinite"
              easing="linear"
            />
          </Entity>
        </Entity>
        {/* Breathing visual feedback */}
        <Entity id="breathing-circle" position="0 1.5 -2">
          <Entity
            primitive="a-ring"
            id="breath-ring"
            ref={breathRingRef}
            color={ringColor} // Use state for dynamic color
            radius-inner="0.4"
            radius-outer="0.5"
            opacity="0.8"
            scale={`${ringScale.x} ${ringScale.y} ${ringScale.z}`} // Use state for dynamic scale
          />
        </Entity>
      </Entity>

      {/* Camera and cursor */}
      <Entity camera look-controls position="0 1.6 0">
        <Entity primitive="a-cursor" id="cursor" color="#FFFFFF" />
      </Entity>
      </Scene>

      {/* UI overlay */}
      <div id="breath-ui">
        <h3>Breathing Meditation</h3>
        <div id="breath-state">State: {breathState}</div>
        <div id="breath-rate">Breathing rate: {breathRate}</div>
        <div className="progress-bar">
          <div 
            id="breath-progress" 
            className="progress" 
            style={{ width: `${progressWidth}%` }}
          ></div>
        </div>
        <button id="toggle-binaural" onClick={toggleBinauralBeats}>
          {binauralEnabled ? 'Disable Binaural Beats' : 'Enable Binaural Beats'}
        </button>
      </div>

      {/* Webcam container (hidden/small by default) */}
      <div id="webcam-container" ref={webcamContainerRef}></div>
      <div id="label-container" ref={labelContainerRef}></div>
    </div>
  );
};

export default YogaBreathing;