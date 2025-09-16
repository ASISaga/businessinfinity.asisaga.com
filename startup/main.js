/**
 * Business Infinity - "The Invitation" Animation
 * 
 * A three.js animation that visualizes the journey from a founder-dependent business
 * to an AI-enhanced, scalable enterprise through 9 key events.
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { AnimationData } from './animation-data.js';
import { SceneManager } from './scene-manager.js';
import { AnimationController } from './animation-controller.js';

class BusinessInfinityAnimation {
  constructor() {
    this.currentEvent = 0;
    this.isPlaying = false;
    this.autoPlayInterval = null;
    
    this.init();
  }
  
  async init() {
    // Show loading indicator
    this.showLoading();
    
    try {
      // Initialize Three.js scene
      this.sceneManager = new SceneManager();
      await this.sceneManager.init();
      
      // Initialize animation controller
      this.animationController = new AnimationController(
        this.sceneManager.scene,
        this.sceneManager.camera,
        this.sceneManager.renderer
      );
      
      // Setup event handlers
      this.setupEventHandlers();
      
      // Start with first event
      this.showEvent(0);
      
      // Hide loading and start animation loop
      this.hideLoading();
      this.startAnimationLoop();
      
    } catch (error) {
      console.error('Failed to initialize animation:', error);
      this.hideLoading();
    }
  }
  
  setupEventHandlers() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playBtn = document.getElementById('playBtn');
    
    prevBtn.addEventListener('click', () => this.previousEvent());
    nextBtn.addEventListener('click', () => this.nextEvent());
    playBtn.addEventListener('click', () => this.togglePlay());
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowLeft') this.previousEvent();
      if (e.code === 'ArrowRight') this.nextEvent();
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }
  
  previousEvent() {
    if (this.currentEvent > 0) {
      this.currentEvent--;
      this.showEvent(this.currentEvent);
    }
  }
  
  nextEvent() {
    if (this.currentEvent < AnimationData.events.length - 1) {
      this.currentEvent++;
      this.showEvent(this.currentEvent);
    }
  }
  
  togglePlay() {
    const playBtn = document.getElementById('playBtn');
    
    if (this.isPlaying) {
      // Stop auto-play
      this.isPlaying = false;
      clearInterval(this.autoPlayInterval);
      playBtn.textContent = 'Play';
    } else {
      // Start auto-play
      this.isPlaying = true;
      playBtn.textContent = 'Pause';
      
      this.autoPlayInterval = setInterval(() => {
        if (this.currentEvent < AnimationData.events.length - 1) {
          this.nextEvent();
        } else {
          // End of animation, stop auto-play
          this.isPlaying = false;
          clearInterval(this.autoPlayInterval);
          playBtn.textContent = 'Play';
        }
      }, 8000); // 8 seconds per event
    }
  }
  
  showEvent(eventIndex) {
    const event = AnimationData.events[eventIndex];
    if (!event) return;
    
    // Update UI
    document.getElementById('currentEvent').textContent = eventIndex + 1;
    document.getElementById('totalEvents').textContent = AnimationData.events.length;
    
    // Update button states
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    prevBtn.disabled = eventIndex === 0;
    nextBtn.disabled = eventIndex === AnimationData.events.length - 1;
    
    // Show narration text
    this.showNarration(event.narration);
    
    // Show on-screen text after delay
    setTimeout(() => {
      this.showOnScreenText(event.onScreenText);
    }, 2000);
    
    // Trigger 3D animation
    this.animationController.showEvent(eventIndex, event);
  }
  
  showNarration(text) {
    const narrationEl = document.getElementById('narration');
    narrationEl.textContent = text;
    narrationEl.classList.remove('active');
    
    // Trigger reflow and add active class
    setTimeout(() => {
      narrationEl.classList.add('active');
    }, 100);
  }
  
  showOnScreenText(textData) {
    const onScreenEl = document.getElementById('onScreenText');
    
    // Clear previous content
    onScreenEl.innerHTML = '';
    onScreenEl.classList.remove('active');
    
    if (textData && textData.length > 0) {
      // Create HTML for on-screen text with highlighting
      const html = textData.map(item => {
        if (item.type === 'highlight') {
          return `<div class="highlight">${item.text}</div>`;
        } else if (item.type === 'emphasis') {
          return `<div class="emphasis">${item.text}</div>`;
        }
        return `<div>${item.text}</div>`;
      }).join('');
      
      onScreenEl.innerHTML = html;
      
      // Trigger appearance animation
      setTimeout(() => {
        onScreenEl.classList.add('active');
      }, 100);
    }
  }
  
  startAnimationLoop() {
    const animate = () => {
      if (this.animationController) {
        this.animationController.update();
      }
      
      if (this.sceneManager) {
        this.sceneManager.render();
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
  
  showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.textContent = 'Loading Business Infinity';
    loading.id = 'loadingIndicator';
    document.body.appendChild(loading);
  }
  
  hideLoading() {
    const loading = document.getElementById('loadingIndicator');
    if (loading) {
      loading.remove();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BusinessInfinityAnimation();
});