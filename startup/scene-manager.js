/**
 * Scene Manager for Business Infinity Animation
 * Handles Three.js scene setup, camera, renderer, and basic lighting
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export class SceneManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
  }
  
  async init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.setupLighting();
    this.setupResizeHandler();
  }
  
  createScene() {
    this.scene = new THREE.Scene();
    
    // Set background color - dark space
    this.scene.background = new THREE.Color(0x0a0a0a);
    
    // Add subtle fog for depth
    this.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.01);
  }
  
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75, // field of view
      window.innerWidth / window.innerHeight, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );
    
    // Position camera for good view of scene
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);
  }
  
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Enable shadows for more realistic lighting
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Set color management
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    
    // Add to DOM
    document.body.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '1';
  }
  
  setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
    
    // Main directional light (key light)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    
    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    
    this.scene.add(directionalLight);
    
    // Fill light to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0x87ceeb, 0.3);
    fillLight.position.set(-10, 5, -5);
    this.scene.add(fillLight);
    
    // Rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0xffd700, 0.2);
    rimLight.position.set(0, -5, -10);
    this.scene.add(rimLight);
  }
  
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      // Update camera aspect ratio
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      
      // Update renderer size
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }
  
  render() {
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
  
  getElapsedTime() {
    return this.clock.getElapsedTime();
  }
  
  // Helper method to smoothly transition camera
  animateCamera(targetPosition, targetLookAt, duration = 2000) {
    const startPosition = this.camera.position.clone();
    const startLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(startLookAt);
    startLookAt.multiplyScalar(-1).add(this.camera.position);
    
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-in-out)
      const eased = progress < 0.5 
        ? 2 * progress * progress 
        : -1 + (4 - 2 * progress) * progress;
      
      // Interpolate position
      this.camera.position.lerpVectors(startPosition, targetPosition, eased);
      
      // Interpolate look-at target
      const currentLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, eased);
      this.camera.lookAt(currentLookAt);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  // Helper method to update background color with transition
  setBackgroundColor(color, duration = 1000) {
    const currentColor = this.scene.background;
    const targetColor = new THREE.Color(color);
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const newColor = currentColor.clone().lerp(targetColor, progress);
      this.scene.background = newColor;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
}