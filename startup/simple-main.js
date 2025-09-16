/**
 * Business Infinity - "The Invitation" Animation
 * Canvas-based animation without external dependencies
 */

import { AnimationData } from './animation-data.js';

class BusinessInfinityAnimation {
  constructor() {
    this.currentEvent = 0;
    this.isPlaying = false;
    this.autoPlayInterval = null;
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.particles = [];
    this.time = 0;
    
    this.init();
  }
  
  async init() {
    // Show loading indicator
    this.showLoading();
    
    try {
      // Initialize canvas
      this.createCanvas();
      
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
  
  createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '1';
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    // Handle resize
    window.addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    });
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
      this.isPlaying = false;
      clearInterval(this.autoPlayInterval);
      playBtn.textContent = 'Play';
    } else {
      this.isPlaying = true;
      playBtn.textContent = 'Pause';
      
      this.autoPlayInterval = setInterval(() => {
        if (this.currentEvent < AnimationData.events.length - 1) {
          this.nextEvent();
        } else {
          this.isPlaying = false;
          clearInterval(this.autoPlayInterval);
          playBtn.textContent = 'Play';
        }
      }, 8000);
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
    
    // Initialize particles for this event
    this.initEventAnimation(eventIndex, event);
  }
  
  showNarration(text) {
    const narrationEl = document.getElementById('narration');
    narrationEl.textContent = text;
    narrationEl.classList.remove('active');
    
    setTimeout(() => {
      narrationEl.classList.add('active');
    }, 100);
  }
  
  showOnScreenText(textData) {
    const onScreenEl = document.getElementById('onScreenText');
    
    onScreenEl.innerHTML = '';
    onScreenEl.classList.remove('active');
    
    if (textData && textData.length > 0) {
      const html = textData.map(item => {
        if (item.type === 'highlight') {
          return `<div class="highlight">${item.text}</div>`;
        } else if (item.type === 'emphasis') {
          return `<div class="emphasis">${item.text}</div>`;
        }
        return `<div>${item.text}</div>`;
      }).join('');
      
      onScreenEl.innerHTML = html;
      
      setTimeout(() => {
        onScreenEl.classList.add('active');
      }, 100);
    }
  }
  
  initEventAnimation(eventIndex, event) {
    // Clear previous particles
    this.particles = [];
    
    // Set background color based on event
    if (event.colors) {
      document.body.style.background = `linear-gradient(135deg, ${event.colors.primary}, ${event.colors.secondary})`;
    }
    
    // Create particles and objects for each event
    switch (eventIndex) {
      case 0:
        this.createEvent1Animation(); // Opening Reality Check
        break;
      case 1:
        this.createEvent2Animation(); // Pain Points
        break;
      case 2:
        this.createEvent3Animation(); // Default Future
        break;
      case 3:
        this.createEvent4Animation(); // Doorway Moment
        break;
      case 4:
        this.createEvent5Animation(); // Boardroom Reveal
        break;
      case 5:
        this.createEvent6Animation(); // Day One in Action
        break;
      case 6:
        this.createEvent7Animation(); // Six Months Later
        break;
      case 7:
        this.createEvent8Animation(); // Two Years Later
        break;
      case 8:
        this.createEvent9Animation(); // Closing Invitation
        break;
    }
  }
  
  createEvent1Animation() {
    // Founder at desk with swirling papers
    this.particles = [];
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 10 + 5,
        type: 'paper',
        color: '#ffffff',
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }
  
  createEvent2Animation() {
    // Central node with connections
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles = [{
      x: centerX,
      y: centerY,
      size: 30,
      type: 'founder',
      color: '#ff6b6b'
    }];
    
    // Add connection endpoints
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 200;
      this.particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: 15,
        type: 'connection',
        color: '#4ecdc4',
        connectionTo: 0,
        tension: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  createEvent3Animation() {
    // Cracks and fading elements
    this.particles = [];
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height - Math.random() * 100,
        size: Math.random() * 20 + 10,
        type: 'crack',
        color: '#8B4513',
        growth: Math.random() * 2 + 1
      });
    }
    
    // Add fading team members
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height * 0.7 + this.canvas.height * 0.3,
        size: 20,
        type: 'person',
        color: '#666666',
        opacity: 1,
        fadeSpeed: 0.005
      });
    }
  }
  
  createEvent4Animation() {
    // Glowing doorway with light particles
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles = [{
      x: centerX,
      y: centerY,
      size: 100,
      type: 'door',
      color: '#ffd700'
    }];
    
    // Add light particles
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
        size: Math.random() * 5 + 2,
        type: 'light',
        color: '#ffed4e',
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
  }
  
  createEvent5Animation() {
    // Circular boardroom with agents
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    // Central core
    this.particles = [{
      x: centerX,
      y: centerY,
      size: 40,
      type: 'core',
      color: '#00ffff',
      pulse: 0
    }];
    
    // AI agents around the table
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 150;
      this.particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: 25,
        type: 'agent',
        color: '#6a5acd',
        pulse: i * 0.5,
        originalX: centerX + Math.cos(angle) * radius,
        originalY: centerY + Math.sin(angle) * radius
      });
    }
  }
  
  createEvent6Animation() {
    // Split screen with active agents
    const quarters = [
      { x: this.canvas.width * 0.25, y: this.canvas.height * 0.25, color: '#ff6b6b', label: 'Marketing' },
      { x: this.canvas.width * 0.75, y: this.canvas.height * 0.25, color: '#4ecdc4', label: 'Finance' },
      { x: this.canvas.width * 0.25, y: this.canvas.height * 0.75, color: '#45b7d1', label: 'Product' },
      { x: this.canvas.width * 0.75, y: this.canvas.height * 0.75, color: '#ffa07a', label: 'Partnership' }
    ];
    
    this.particles = quarters.map((q, i) => ({
      x: q.x,
      y: q.y,
      size: 50,
      type: 'splitAgent',
      color: q.color,
      label: q.label,
      activity: 0
    }));
  }
  
  createEvent7Animation() {
    // Expanding map with growing markets
    this.particles = [];
    for (let i = 0; i < 25; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 10 + 5,
        type: 'market',
        color: '#00ff00',
        growth: Math.random() * 0.5 + 0.5,
        maxSize: Math.random() * 30 + 20
      });
    }
  }
  
  createEvent8Animation() {
    // Evolving system with morphing elements
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles = [];
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 100 + Math.random() * 100;
      this.particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: Math.random() * 20 + 10,
        type: 'system',
        color: '#9370db',
        angle: angle,
        radius: radius,
        morphSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }
  
  createEvent9Animation() {
    // Final doorway with expanding light
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    
    this.particles = [{
      x: centerX,
      y: centerY,
      size: 150,
      type: 'finalDoor',
      color: '#ffffff',
      expansion: 0
    }];
    
    // Add expanding light rays
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      this.particles.push({
        x: centerX,
        y: centerY,
        size: 5,
        type: 'ray',
        color: '#ffed4e',
        angle: angle,
        length: 0,
        maxLength: Math.max(this.canvas.width, this.canvas.height)
      });
    }
  }
  
  startAnimationLoop() {
    const animate = () => {
      this.update();
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }
  
  update() {
    this.time += 0.016; // ~60fps
    
    this.particles.forEach((particle, index) => {
      switch (particle.type) {
        case 'paper':
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.rotation += particle.rotationSpeed;
          
          // Wrap around screen
          if (particle.x < 0) particle.x = this.canvas.width;
          if (particle.x > this.canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = this.canvas.height;
          if (particle.y > this.canvas.height) particle.y = 0;
          break;
          
        case 'connection':
          if (particle.connectionTo !== undefined) {
            particle.tension = 0.5 + Math.sin(this.time * 3 + index) * 0.3;
          }
          break;
          
        case 'crack':
          particle.size += particle.growth * 0.1;
          if (particle.size > 50) particle.growth *= -1;
          if (particle.size < 10) particle.growth *= -1;
          break;
          
        case 'person':
          particle.opacity -= particle.fadeSpeed;
          if (particle.opacity <= 0) {
            particle.opacity = 1;
          }
          break;
          
        case 'light':
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.opacity = 0.5 + Math.sin(this.time * 4 + index) * 0.3;
          break;
          
        case 'agent':
          particle.pulse += 0.1;
          particle.x = particle.originalX + Math.sin(particle.pulse) * 3;
          particle.y = particle.originalY + Math.cos(particle.pulse) * 3;
          break;
          
        case 'core':
          particle.pulse += 0.05;
          break;
          
        case 'market':
          if (particle.size < particle.maxSize) {
            particle.size += particle.growth;
          }
          break;
          
        case 'system':
          particle.angle += particle.morphSpeed;
          particle.x = this.canvas.width / 2 + Math.cos(particle.angle) * particle.radius;
          particle.y = this.canvas.height / 2 + Math.sin(particle.angle) * particle.radius;
          break;
          
        case 'ray':
          if (particle.length < particle.maxLength) {
            particle.length += 10;
          }
          break;
          
        case 'finalDoor':
          particle.expansion += 1;
          break;
      }
    });
  }
  
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle) => {
      this.ctx.save();
      
      switch (particle.type) {
        case 'paper':
          this.ctx.translate(particle.x, particle.y);
          this.ctx.rotate(particle.rotation);
          this.ctx.fillStyle = particle.color;
          this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size * 1.3);
          break;
          
        case 'founder':
        case 'connection':
        case 'agent':
        case 'market':
        case 'system':
          this.ctx.fillStyle = particle.color;
          if (particle.type === 'agent') {
            const pulse = 1 + Math.sin(particle.pulse) * 0.2;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
            this.ctx.fill();
          } else if (particle.type === 'market') {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
          } else {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
          }
          break;
          
        case 'core':
          const corePulse = 1 + Math.sin(particle.pulse * 2) * 0.3;
          this.ctx.fillStyle = particle.color;
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size * corePulse, 0, Math.PI * 2);
          this.ctx.fill();
          break;
          
        case 'crack':
          this.ctx.strokeStyle = particle.color;
          this.ctx.lineWidth = particle.size / 5;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(particle.x + particle.size * 2, particle.y + Math.random() * 20 - 10);
          this.ctx.stroke();
          break;
          
        case 'person':
          this.ctx.globalAlpha = particle.opacity;
          this.ctx.fillStyle = particle.color;
          this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size, particle.size, particle.size * 2);
          this.ctx.globalAlpha = 1;
          break;
          
        case 'light':
          this.ctx.globalAlpha = particle.opacity;
          this.ctx.fillStyle = particle.color;
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.globalAlpha = 1;
          break;
          
        case 'door':
          this.ctx.fillStyle = particle.color;
          this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size, particle.size, particle.size * 2);
          
          // Add glow effect
          this.ctx.shadowColor = particle.color;
          this.ctx.shadowBlur = 20;
          this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size, particle.size, particle.size * 2);
          this.ctx.shadowBlur = 0;
          break;
          
        case 'splitAgent':
          this.ctx.fillStyle = particle.color;
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
          
          // Add activity ripples
          this.ctx.strokeStyle = particle.color;
          this.ctx.lineWidth = 2;
          for (let i = 0; i < 3; i++) {
            const ripple = particle.size + (this.time * 50 + i * 20) % 100;
            this.ctx.globalAlpha = 1 - (ripple - particle.size) / 100;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, ripple, 0, Math.PI * 2);
            this.ctx.stroke();
          }
          this.ctx.globalAlpha = 1;
          break;
          
        case 'ray':
          this.ctx.strokeStyle = particle.color;
          this.ctx.lineWidth = 3;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(
            particle.x + Math.cos(particle.angle) * particle.length,
            particle.y + Math.sin(particle.angle) * particle.length
          );
          this.ctx.stroke();
          break;
          
        case 'finalDoor':
          this.ctx.fillStyle = particle.color;
          this.ctx.globalAlpha = Math.max(0, 1 - particle.expansion / 300);
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size + particle.expansion, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.globalAlpha = 1;
          break;
      }
      
      this.ctx.restore();
    });
    
    // Draw connections for event 2
    if (this.currentEvent === 1) {
      this.particles.forEach((particle, index) => {
        if (particle.type === 'connection' && particle.connectionTo !== undefined) {
          const founder = this.particles[particle.connectionTo];
          this.ctx.strokeStyle = '#00bfff';
          this.ctx.lineWidth = 2 * particle.tension;
          this.ctx.beginPath();
          this.ctx.moveTo(founder.x, founder.y);
          this.ctx.lineTo(particle.x, particle.y);
          this.ctx.stroke();
        }
      });
    }
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