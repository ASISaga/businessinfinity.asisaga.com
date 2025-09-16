/**
 * Animation Controller for Business Infinity
 * Manages 3D objects and animations for each event
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';

export class AnimationController {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.objects = new Map();
    this.animations = [];
    this.currentEventIndex = -1;
    
    // Initialize base objects
    this.init();
  }
  
  init() {
    // Create reusable geometries and materials
    this.geometries = {
      box: new THREE.BoxGeometry(1, 1, 1),
      sphere: new THREE.SphereGeometry(1, 16, 12),
      plane: new THREE.PlaneGeometry(1, 1),
      cylinder: new THREE.CylinderGeometry(1, 1, 1, 16),
      ring: new THREE.RingGeometry(0.5, 1, 16)
    };
    
    this.materials = {
      desk: new THREE.MeshPhongMaterial({ color: 0x8B4513 }),
      founder: new THREE.MeshPhongMaterial({ color: 0x4A4A4A }),
      papers: new THREE.MeshPhongMaterial({ color: 0xFFFFFF }),
      screen: new THREE.MeshBasicMaterial({ color: 0x00FF00, emissive: 0x002200 }),
      agent: new THREE.MeshPhongMaterial({ color: 0x6A5ACD, emissive: 0x1A1A3A }),
      connection: new THREE.LineBasicMaterial({ color: 0x00BFFF }),
      door: new THREE.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x332200 }),
      energy: new THREE.MeshBasicMaterial({ 
        color: 0x00FFFF, 
        emissive: 0x004444,
        transparent: true,
        opacity: 0.7
      })
    };
  }
  
  showEvent(eventIndex, eventData) {
    if (this.currentEventIndex === eventIndex) return;
    
    // Clear previous event objects
    this.clearEvent();
    
    this.currentEventIndex = eventIndex;
    
    // Set scene colors based on event
    if (eventData.colors) {
      this.setSceneAmbience(eventData.colors);
    }
    
    // Create and animate objects for this event
    switch (eventIndex) {
      case 0:
        this.createEvent1_OpeningReality();
        break;
      case 1:
        this.createEvent2_PainPoints();
        break;
      case 2:
        this.createEvent3_DefaultFuture();
        break;
      case 3:
        this.createEvent4_DoorwayMoment();
        break;
      case 4:
        this.createEvent5_BoardroomReveal();
        break;
      case 5:
        this.createEvent6_DayOneInAction();
        break;
      case 6:
        this.createEvent7_SixMonthsLater();
        break;
      case 7:
        this.createEvent8_TwoYearsLater();
        break;
      case 8:
        this.createEvent9_ClosingInvitation();
        break;
    }
  }
  
  createEvent1_OpeningReality() {
    // Desk
    const desk = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 2),
      this.materials.desk
    );
    desk.position.set(0, -1, 0);
    desk.castShadow = true;
    this.scene.add(desk);
    this.objects.set('desk', desk);
    
    // Founder figure (simplified)
    const founderBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 1.5, 0.3),
      this.materials.founder
    );
    founderBody.position.set(0, 0, 0.5);
    founderBody.castShadow = true;
    this.scene.add(founderBody);
    this.objects.set('founder', founderBody);
    
    // Floating screens/dashboards
    const screens = [];
    for (let i = 0; i < 5; i++) {
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.2, 0.8),
        this.materials.screen
      );
      
      const angle = (i / 5) * Math.PI * 2;
      screen.position.set(
        Math.cos(angle) * 3,
        Math.sin(i) * 1.5 + 1,
        Math.sin(angle) * 2
      );
      screen.lookAt(0, 0, 0);
      
      this.scene.add(screen);
      screens.push(screen);
    }
    this.objects.set('screens', screens);
    
    // Animated papers
    const papers = [];
    for (let i = 0; i < 10; i++) {
      const paper = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, 0.4),
        this.materials.papers
      );
      paper.position.set(
        (Math.random() - 0.5) * 3,
        Math.random() * 2 + 0.5,
        (Math.random() - 0.5) * 2
      );
      paper.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      this.scene.add(paper);
      papers.push(paper);
    }
    this.objects.set('papers', papers);
    
    // Animate papers swirling
    this.addAnimation(() => {
      papers.forEach((paper, index) => {
        const time = Date.now() * 0.0005;
        paper.rotation.z += 0.01;
        paper.position.y += Math.sin(time + index) * 0.002;
      });
    });
    
    // Camera position for this scene
    this.setCameraPosition(new THREE.Vector3(3, 2, 8), new THREE.Vector3(0, 0, 0));
  }
  
  createEvent2_PainPoints() {
    // Central founder figure
    const founder = new THREE.Mesh(
      this.geometries.sphere,
      new THREE.MeshPhongMaterial({ color: 0xFF6B6B })
    );
    founder.position.set(0, 0, 0);
    founder.scale.setScalar(0.8);
    this.scene.add(founder);
    this.objects.set('founder', founder);
    
    // Connection threads radiating outward
    const connections = [];
    const endpoints = [];
    
    for (let i = 0; i < 12; i++) {
      const angle1 = (i / 12) * Math.PI * 2;
      const angle2 = Math.sin(i) * 0.5;
      
      const endpoint = new THREE.Mesh(
        this.geometries.sphere,
        new THREE.MeshPhongMaterial({ color: 0x4ECDC4 })
      );
      endpoint.position.set(
        Math.cos(angle1) * 5,
        Math.sin(angle2) * 3,
        Math.sin(angle1) * 5
      );
      endpoint.scale.setScalar(0.3);
      this.scene.add(endpoint);
      endpoints.push(endpoint);
      
      // Create connection line
      const points = [
        new THREE.Vector3(0, 0, 0),
        endpoint.position.clone()
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, this.materials.connection);
      this.scene.add(line);
      connections.push(line);
    }
    
    this.objects.set('connections', connections);
    this.objects.set('endpoints', endpoints);
    
    // Animate tension in threads
    this.addAnimation(() => {
      const time = Date.now() * 0.003;
      connections.forEach((line, index) => {
        const geometry = line.geometry;
        const positions = geometry.attributes.position.array;
        
        // Add slight vibration to the line
        positions[3] += Math.sin(time + index) * 0.05;
        positions[4] += Math.cos(time + index * 1.5) * 0.03;
        positions[5] += Math.sin(time * 1.2 + index) * 0.05;
        
        geometry.attributes.position.needsUpdate = true;
      });
    });
    
    this.setCameraPosition(new THREE.Vector3(8, 4, 8), new THREE.Vector3(0, 0, 0));
  }
  
  createEvent3_DefaultFuture() {
    // Ground with cracks
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 32, 32),
      new THREE.MeshPhongMaterial({ 
        color: 0x654321,
        wireframe: false
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.scene.add(ground);
    this.objects.set('ground', ground);
    
    // Competitor ships in distance
    const ships = [];
    for (let i = 0; i < 3; i++) {
      const ship = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 2, 6),
        new THREE.MeshPhongMaterial({ color: 0x32CD32 })
      );
      ship.position.set(
        (i - 1) * 3 - 8,
        0,
        -10 + i
      );
      ship.rotation.z = Math.PI / 2;
      this.scene.add(ship);
      ships.push(ship);
    }
    this.objects.set('ships', ships);
    
    // Your boat (chained)
    const yourBoat = new THREE.Mesh(
      new THREE.ConeGeometry(0.5, 2, 6),
      new THREE.MeshPhongMaterial({ color: 0xFF4500 })
    );
    yourBoat.position.set(0, 0, 0);
    yourBoat.rotation.z = Math.PI / 2;
    this.scene.add(yourBoat);
    this.objects.set('yourBoat', yourBoat);
    
    // Chain
    const chain = [];
    for (let i = 0; i < 5; i++) {
      const link = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.05),
        new THREE.MeshPhongMaterial({ color: 0x696969 })
      );
      link.position.set(i * 0.4, -0.5, 0.2);
      this.scene.add(link);
      chain.push(link);
    }
    this.objects.set('chain', chain);
    
    // Animate ships moving away
    this.addAnimation(() => {
      ships.forEach((ship, index) => {
        ship.position.x -= 0.02;
        if (ship.position.x < -15) ship.position.x = 5;
      });
    });
    
    this.setCameraPosition(new THREE.Vector3(5, 3, 10), new THREE.Vector3(0, 0, -2));
  }
  
  createEvent4_DoorwayMoment() {
    // Door frame
    const doorFrame = new THREE.Group();
    
    const leftPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 6, 0.3),
      this.materials.door
    );
    leftPost.position.set(-2, 0, 0);
    doorFrame.add(leftPost);
    
    const rightPost = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 6, 0.3),
      this.materials.door
    );
    rightPost.position.set(2, 0, 0);
    doorFrame.add(rightPost);
    
    const topPost = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.3, 0.3),
      this.materials.door
    );
    topPost.position.set(0, 3, 0);
    doorFrame.add(topPost);
    
    this.scene.add(doorFrame);
    this.objects.set('doorFrame', doorFrame);
    
    // Glowing light through the doorway
    const doorLight = new THREE.PointLight(0xFFD700, 2, 10);
    doorLight.position.set(0, 1, -2);
    this.scene.add(doorLight);
    this.objects.set('doorLight', doorLight);
    
    // Light particles
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const particle = new THREE.Mesh(
        this.geometries.sphere,
        this.materials.energy
      );
      particle.scale.setScalar(0.1);
      particle.position.set(
        (Math.random() - 0.5) * 4,
        Math.random() * 4,
        Math.random() * 2 - 3
      );
      this.scene.add(particle);
      particles.push(particle);
    }
    this.objects.set('particles', particles);
    
    // Animate particles
    this.addAnimation(() => {
      const time = Date.now() * 0.002;
      particles.forEach((particle, index) => {
        particle.position.y += Math.sin(time + index) * 0.01;
        particle.position.x += Math.cos(time + index * 1.5) * 0.005;
        particle.material.opacity = 0.3 + Math.sin(time + index * 2) * 0.3;
      });
    });
    
    this.setCameraPosition(new THREE.Vector3(0, 2, 12), new THREE.Vector3(0, 1, 0));
  }
  
  createEvent5_BoardroomReveal() {
    // Boardroom table
    const table = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 0.2, 12),
      new THREE.MeshPhongMaterial({ color: 0x8B4513, shininess: 100 })
    );
    table.position.y = -0.1;
    this.scene.add(table);
    this.objects.set('table', table);
    
    // AI Agents around table
    const agents = [];
    const agentCount = 8;
    
    for (let i = 0; i < agentCount; i++) {
      const angle = (i / agentCount) * Math.PI * 2;
      
      const agent = new THREE.Mesh(
        this.geometries.sphere,
        this.materials.agent
      );
      agent.position.set(
        Math.cos(angle) * 2.5,
        1,
        Math.sin(angle) * 2.5
      );
      agent.scale.setScalar(0.6);
      
      this.scene.add(agent);
      agents.push(agent);
      
      // Add glow effect
      const glow = new THREE.PointLight(0x6A5ACD, 0.5, 3);
      glow.position.copy(agent.position);
      this.scene.add(glow);
    }
    
    this.objects.set('agents', agents);
    
    // Central data core
    const core = new THREE.Mesh(
      this.geometries.sphere,
      new THREE.MeshBasicMaterial({ 
        color: 0x00FFFF,
        emissive: 0x004444,
        transparent: true,
        opacity: 0.8
      })
    );
    core.position.set(0, 1.5, 0);
    core.scale.setScalar(0.5);
    this.scene.add(core);
    this.objects.set('core', core);
    
    // Animate agents pulsing
    this.addAnimation(() => {
      const time = Date.now() * 0.003;
      agents.forEach((agent, index) => {
        const pulse = 1 + Math.sin(time + index * 0.5) * 0.2;
        agent.scale.setScalar(0.6 * pulse);
        agent.material.emissive.setScalar(0.1 + Math.sin(time + index) * 0.1);
      });
      
      // Rotate core
      core.rotation.x += 0.01;
      core.rotation.y += 0.02;
    });
    
    // Orbit camera around the table
    this.setCameraOrbit(8, 3, 0.5);
  }
  
  createEvent6_DayOneInAction() {
    this.createSplitScreenAgents();
    this.setCameraPosition(new THREE.Vector3(0, 5, 12), new THREE.Vector3(0, 0, 0));
  }
  
  createEvent7_SixMonthsLater() {
    this.createExpandingMap();
    this.setCameraPosition(new THREE.Vector3(0, 8, 15), new THREE.Vector3(0, 0, 0));
  }
  
  createEvent8_TwoYearsLater() {
    this.createEvolvingSystem();
    this.setCameraPosition(new THREE.Vector3(5, 5, 10), new THREE.Vector3(0, 2, 0));
  }
  
  createEvent9_ClosingInvitation() {
    this.createFinalDoorway();
    this.setCameraPosition(new THREE.Vector3(0, 3, 15), new THREE.Vector3(0, 1, 0));
  }
  
  // Helper methods
  createSplitScreenAgents() {
    const agents = [
      { name: 'Marketing', color: 0xFF6B6B, position: [-4, 1, 2] },
      { name: 'Finance', color: 0x4ECDC4, position: [4, 1, 2] },
      { name: 'Product', color: 0x45B7D1, position: [-4, 1, -2] },
      { name: 'Partnership', color: 0xFFA07A, position: [4, 1, -2] }
    ];
    
    const agentMeshes = [];
    
    agents.forEach((agentData, index) => {
      const agent = new THREE.Mesh(
        this.geometries.box,
        new THREE.MeshPhongMaterial({ color: agentData.color })
      );
      agent.position.set(...agentData.position);
      this.scene.add(agent);
      agentMeshes.push(agent);
    });
    
    this.objects.set('splitAgents', agentMeshes);
  }
  
  createExpandingMap() {
    const map = new THREE.Group();
    
    // Create markets as glowing dots
    for (let i = 0; i < 20; i++) {
      const market = new THREE.Mesh(
        this.geometries.sphere,
        new THREE.MeshBasicMaterial({ 
          color: 0x00FF00,
          emissive: 0x002200
        })
      );
      market.position.set(
        (Math.random() - 0.5) * 15,
        0,
        (Math.random() - 0.5) * 15
      );
      market.scale.setScalar(0.2);
      map.add(market);
    }
    
    this.scene.add(map);
    this.objects.set('map', map);
    
    // Animate expansion
    this.addAnimation(() => {
      const time = Date.now() * 0.001;
      const scale = 1 + Math.sin(time) * 0.3;
      map.scale.setScalar(scale);
    });
  }
  
  createEvolvingSystem() {
    // Create morphing geometric structures
    const system = new THREE.Group();
    
    for (let i = 0; i < 10; i++) {
      const element = new THREE.Mesh(
        this.geometries.sphere,
        new THREE.MeshPhongMaterial({ color: 0x9370DB })
      );
      element.position.set(
        Math.cos(i * 0.6) * 3,
        Math.sin(i * 0.8) * 2,
        Math.sin(i * 0.6) * 3
      );
      element.scale.setScalar(0.3);
      system.add(element);
    }
    
    this.scene.add(system);
    this.objects.set('system', system);
    
    // Animate evolution
    this.addAnimation(() => {
      const time = Date.now() * 0.001;
      system.rotation.y += 0.005;
      system.children.forEach((child, index) => {
        child.scale.setScalar(0.3 + Math.sin(time + index) * 0.1);
      });
    });
  }
  
  createFinalDoorway() {
    // Larger, more impressive doorway
    const doorway = new THREE.Group();
    
    const arch = new THREE.Mesh(
      new THREE.RingGeometry(2, 4, 16),
      this.materials.door
    );
    arch.position.set(0, 2, 0);
    doorway.add(arch);
    
    // Bright light
    const light = new THREE.PointLight(0xFFFFFF, 3, 20);
    light.position.set(0, 2, -5);
    doorway.add(light);
    
    this.scene.add(doorway);
    this.objects.set('finalDoor', doorway);
    
    // Expanding light effect
    this.addAnimation(() => {
      const time = Date.now() * 0.002;
      light.intensity = 3 + Math.sin(time) * 1;
    });
  }
  
  // Camera control methods
  setCameraPosition(position, lookAt) {
    this.camera.position.copy(position);
    this.camera.lookAt(lookAt);
  }
  
  setCameraOrbit(radius, height, speed) {
    this.addAnimation(() => {
      const time = Date.now() * speed * 0.001;
      this.camera.position.x = Math.cos(time) * radius;
      this.camera.position.z = Math.sin(time) * radius;
      this.camera.position.y = height;
      this.camera.lookAt(0, 0, 0);
    });
  }
  
  setSceneAmbience(colors) {
    // Update background color
    this.scene.background = new THREE.Color(colors.primary);
    
    // Update fog color
    this.scene.fog.color = new THREE.Color(colors.primary);
  }
  
  addAnimation(animationFunction) {
    this.animations.push(animationFunction);
  }
  
  clearEvent() {
    // Remove all objects from previous event
    this.objects.forEach((obj, key) => {
      if (Array.isArray(obj)) {
        obj.forEach(item => this.scene.remove(item));
      } else {
        this.scene.remove(obj);
      }
    });
    this.objects.clear();
    
    // Clear animations
    this.animations = [];
    
    // Reset camera
    this.camera.position.set(0, 5, 15);
    this.camera.lookAt(0, 0, 0);
  }
  
  update() {
    // Run all active animations
    this.animations.forEach(animation => animation());
  }
}