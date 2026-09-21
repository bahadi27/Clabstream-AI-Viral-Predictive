import React, { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { RetentionPoint, VideoKeyframe, BrainRegionKey } from "../types";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Eye,
  Camera,
  Activity,
  Compass,
  Volume2,
  VolumeX,
  ChevronRight,
  Flame,
  Layers,
  ArrowRight
} from "lucide-react";
import { parseTimestampToSeconds } from "./MiniVideoPlayer";

interface SpatialRetention3DProps {
  curve: RetentionPoint[];
  keyframes?: VideoKeyframe[];
  videoDurationSeconds?: number;
  onOpenKeyframeInsight?: (keyframe: VideoKeyframe) => void;
  onSeekToKeyframe?: (timeInSeconds: number) => void;
}

export const SpatialRetention3D: React.FC<SpatialRetention3DProps> = ({
  curve,
  keyframes = [],
  videoDurationSeconds = 30,
  onOpenKeyframeInsight,
  onSeekToKeyframe,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction & Camera States
  const [cameraMode, setCameraMode] = useState<"orbit" | "flight" | "isometric">("orbit");
  const [isPlayingFlight, setIsPlayingFlight] = useState<boolean>(false);
  const [flightProgress, setFlightProgress] = useState<number>(0); // 0 to 1
  const [flightSpeed, setFlightSpeed] = useState<number>(1); // 1x or 2x
  const [hoveredKeyframe, setHoveredKeyframe] = useState<VideoKeyframe | null>(null);
  const [selectedKeyframe, setSelectedKeyframe] = useState<VideoKeyframe | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentMetricState, setCurrentMetricState] = useState<{
    timeSec: number;
    retention: number;
    delta: number;
    status: "peak" | "drop" | "stable";
  }>({
    timeSec: 0,
    retention: curve?.[0]?.retention || 100,
    delta: 0,
    status: "peak",
  });

  // Safe Web Audio API sound synthesizer
  const playCyberSound = (freq = 440, type: OscillatorType = "sine", duration = 0.08) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or supported in this context
    }
  };

  // Sort and process keyframes
  const sortedKeyframes = useMemo(() => {
    if (!keyframes || keyframes.length === 0) {
      // Synthesize standard short-form milestones if none provided
      return [
        {
          timestamp: "00:00.5",
          timeInSeconds: 0.5,
          label: "First-Frame Hook",
          type: "hook" as const,
          score: 94,
          note: "High visual novelty and immediate kinetic text entry locks early attention.",
        },
        {
          timestamp: "00:03.0",
          timeInSeconds: 3.0,
          label: "Pattern Interrupt",
          type: "pattern_break" as const,
          score: 88,
          note: "Camera angle shift and sonic punch arrests swipe momentum.",
        },
        {
          timestamp: "00:08.0",
          timeInSeconds: 8.0,
          label: "Dopamine Climax",
          type: "emotional_peak" as const,
          score: 92,
          note: "Peak visual clarity and emotional tension peak.",
        },
        {
          timestamp: "00:14.0",
          timeInSeconds: 14.0,
          label: "Loop Payoff",
          type: "payoff" as const,
          score: 89,
          note: "Circular narrative resolution encourages instant loop re-watch.",
        },
      ];
    }
    return [...keyframes].sort((a, b) => {
      const ta = a.timeInSeconds ?? parseTimestampToSeconds(a.timestamp);
      const tb = b.timeInSeconds ?? parseTimestampToSeconds(b.timestamp);
      return ta - tb;
    });
  }, [keyframes]);

  // Keep mutable references for animation loop
  const flightProgressRef = useRef(0);
  flightProgressRef.current = flightProgress;
  const isPlayingFlightRef = useRef(isPlayingFlight);
  isPlayingFlightRef.current = isPlayingFlight;
  const cameraModeRef = useRef(cameraMode);
  cameraModeRef.current = cameraMode;
  const flightSpeedRef = useRef(flightSpeed);
  flightSpeedRef.current = flightSpeed;

  // Jump to specific timestamp
  const handleJumpToKeyframe = (kf: VideoKeyframe) => {
    setSelectedKeyframe(kf);
    const sec = kf.timeInSeconds ?? parseTimestampToSeconds(kf.timestamp);
    const ratio = Math.min(1, Math.max(0, sec / (videoDurationSeconds || 30)));
    setFlightProgress(ratio);
    playCyberSound(587.33, "triangle", 0.12);
    if (onSeekToKeyframe) {
      onSeekToKeyframe(sec);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    let animId: number;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#05050A");
    scene.fog = new THREE.FogExp2("#05050A", 0.022);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 7, 24);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current || undefined,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Lighting (High-Contrast Cyberpunk Palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const cyanPoint = new THREE.PointLight(0x00F5D4, 2.8, 45);
    cyanPoint.position.set(-8, 12, 10);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0x7B2CBF, 3.2, 50);
    violetPoint.position.set(8, 14, -10);
    scene.add(violetPoint);

    const pinkKeyLight = new THREE.DirectionalLight(0xFF007F, 0.9);
    pinkKeyLight.position.set(0, 15, 20);
    scene.add(pinkKeyLight);

    // 3. Cybernetic Floor Grid with Radial Falloff
    const gridHelper = new THREE.GridHelper(60, 60, 0x00F5D4, 0x1A1A2E);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Ground reflective subtle plane
    const floorGeo = new THREE.PlaneGeometry(80, 80);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x030307,
      roughness: 0.85,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2.05;
    scene.add(floorMesh);

    // 4. Construct the 3D Retention Rollercoaster Spline
    // We map curve points into 3D space:
    // Z: stretching from +15 (second 0) to -25 (last second)
    // Y: retention height (0% = 0, 100% = 8 units)
    // X: dynamic kinetic weave based on narrative momentum
    const points3D: THREE.Vector3[] = [];
    const safeCurve = Array.isArray(curve) && curve.length > 0
      ? curve
      : Array.from({ length: 11 }, (_, i) => ({ t: i * 10, retention: Math.max(20, 100 - i * 3.5) }));
    const numPoints = safeCurve.length;
    const zStart = 14;
    const zEnd = -22;

    for (let i = 0; i < numPoints; i++) {
      const pt = safeCurve[i] || { t: (i / (numPoints - 1)) * 100, retention: 85 - i * 4 };
      const normT = i / (numPoints - 1);
      const z = zStart + normT * (zEnd - zStart);
      const retNorm = Math.max(0, Math.min(100, pt.retention)) / 100;
      const y = retNorm * 7.5 - 0.5; // height
      // Organic kinetic weave on X axis
      const x = Math.sin(normT * Math.PI * 3) * 1.8 + Math.cos(normT * Math.PI * 1.5) * 0.8;
      points3D.push(new THREE.Vector3(x, y, z));
    }

    const splineCurve = new THREE.CatmullRomCurve3(points3D);
    splineCurve.curveType = "catmullrom";
    splineCurve.tension = 0.5;

    // 5. Rollercoaster Main Glowing Ribbon / Tube
    const tubeGeo = new THREE.TubeGeometry(splineCurve, 120, 0.22, 12, false);
    
    // Create dual-tone glowing gradient along vertices
    const tubePositions = tubeGeo.attributes.position;
    const tubeColors = new Float32Array(tubePositions.count * 3);
    const colorPeak = new THREE.Color(0x00F5D4); // Neon Mint
    const colorMid = new THREE.Color(0x7B2CBF);  // Royal Violet
    const colorDrop = new THREE.Color(0xFF0055); // Crimson warning
    const tempColor = new THREE.Color();

    for (let i = 0; i < tubePositions.count; i++) {
      const y = tubePositions.getY(i);
      const tNorm = Math.min(1, Math.max(0, (y + 0.5) / 7.5));
      if (tNorm > 0.75) {
        tempColor.lerpColors(colorMid, colorPeak, (tNorm - 0.75) / 0.25);
      } else {
        tempColor.lerpColors(colorDrop, colorMid, tNorm / 0.75);
      }
      tubeColors[i * 3] = tempColor.r;
      tubeColors[i * 3 + 1] = tempColor.g;
      tubeColors[i * 3 + 2] = tempColor.b;
    }
    tubeGeo.setAttribute("color", new THREE.BufferAttribute(tubeColors, 3));

    const tubeMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.25,
      metalness: 0.8,
      emissive: 0x051515,
      emissiveIntensity: 0.4,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // 6. Secondary Outer Kinetic Rail (Parallel Energy Wire)
    const wirePoints = splineCurve.getPoints(120).map((p) => new THREE.Vector3(p.x, p.y + 0.35, p.z));
    const wireGeo = new THREE.BufferGeometry().setFromPoints(wirePoints);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x00F5D4,
      transparent: true,
      opacity: 0.85,
      linewidth: 2,
    });
    const wireLine = new THREE.Line(wireGeo, wireMat);
    scene.add(wireLine);

    // 7. Retention Vertical Curtain / Glass Drop Mesh
    // Gives volume to the graph so it feels like a mountain landscape
    const curtainGeo = new THREE.PlaneGeometry(1, 1, 100, 1);
    const curtainPositions = curtainGeo.attributes.position;
    const curveSamples = splineCurve.getPoints(100);

    for (let i = 0; i <= 100; i++) {
      const topPt = curveSamples[i];
      // Top vertex (row 0)
      curtainPositions.setXYZ(i, topPt.x, topPt.y, topPt.z);
      // Bottom vertex (row 1)
      curtainPositions.setXYZ(i + 101, topPt.x, -2, topPt.z);
    }
    curtainGeo.computeVertexNormals();

    const curtainMat = new THREE.MeshBasicMaterial({
      color: 0x00F5D4,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      wireframe: true,
    });
    const curtainMesh = new THREE.Mesh(curtainGeo, curtainMat);
    scene.add(curtainMesh);

    // 8. Interactive Milestone Portals / Monoliths
    const keyframeObjects: { mesh: THREE.Group; keyframe: VideoKeyframe; t: number }[] = [];
    const interactiveMeshes: THREE.Object3D[] = [];

    sortedKeyframes.forEach((kf) => {
      const sec = kf.timeInSeconds ?? parseTimestampToSeconds(kf.timestamp);
      const ratio = Math.min(1, Math.max(0, sec / (videoDurationSeconds || 30)));
      const pos = splineCurve.getPointAt(ratio);

      const group = new THREE.Group();
      group.position.copy(pos);

      // Color scheme according to keyframe type
      let ringColor = 0x00F5D4;
      if (kf.type === "pattern_break") ringColor = 0xFFB703;
      if (kf.type === "emotional_peak") ringColor = 0xFF007F;
      if (kf.type === "payoff") ringColor = 0x7B2CBF;

      // Outer floating portal ring
      const ringGeo = new THREE.TorusGeometry(0.7, 0.04, 12, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: ringColor,
        emissive: ringColor,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.y = Math.PI / 2;
      group.add(ringMesh);

      // Inner Floating Crystal / Diamond Core
      const coreGeo = new THREE.OctahedronGeometry(0.35, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: ringColor,
        emissiveIntensity: 0.9,
        metalness: 0.9,
        roughness: 0.1,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      (coreMesh as any).userData = { keyframe: kf };
      group.add(coreMesh);
      interactiveMeshes.push(coreMesh);

      // Vertical Laser Anchor to Floor
      const laserGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -pos.y - 2, 0),
      ]);
      const laserMat = new THREE.LineBasicMaterial({
        color: ringColor,
        transparent: true,
        opacity: 0.35,
      });
      const laserLine = new THREE.Line(laserGeo, laserMat);
      group.add(laserLine);

      scene.add(group);
      keyframeObjects.push({ mesh: group, keyframe: kf, t: ratio });
    });

    // 9. Floating Synaptic / Energy Particles
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 35;
      particlePos[i * 3 + 1] = Math.random() * 12 - 1.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 45;

      const pColor = i % 2 === 0 ? colorPeak : colorMid;
      particleColors[i * 3] = pColor.r;
      particleColors[i * 3 + 1] = pColor.g;
      particleColors[i * 3 + 2] = pColor.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 10. Traveling Energy Orb (Viewer Traffic Pulse)
    const orbGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x00F5D4,
      emissive: 0x00F5D4,
      emissiveIntensity: 1.5,
      roughness: 0.1,
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orbMesh);

    // 11. Mouse / Touch Controls & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let orbitAzimuth = 0;
    let orbitPolar = Math.PI / 3.8;
    let orbitDistance = 24;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && cameraModeRef.current === "orbit") {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        orbitAzimuth -= deltaX * 0.005;
        orbitPolar = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, orbitPolar - deltaY * 0.005));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      // Raycast click on milestone diamonds
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const hitKeyframe = (intersects[0].object as any).userData?.keyframe as VideoKeyframe;
        if (hitKeyframe) {
          handleJumpToKeyframe(hitKeyframe);
        }
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (cameraModeRef.current === "orbit") {
        e.preventDefault();
        orbitDistance = Math.max(8, Math.min(45, orbitDistance + e.deltaY * 0.02));
      }
    };

    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // 12. Main Animation & Render Loop
    let clock = new THREE.Clock();
    let orbT = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Animate Traveling Orb
      orbT = (orbT + delta * 0.12) % 1;
      const orbPoint = splineCurve.getPointAt(orbT);
      orbMesh.position.copy(orbPoint);

      // Animate Keyframe Rings and Crystals
      keyframeObjects.forEach((kfObj, idx) => {
        const ring = kfObj.mesh.children[0];
        const crystal = kfObj.mesh.children[1];
        if (ring) {
          ring.rotation.z = elapsed * 1.5 + idx;
        }
        if (crystal) {
          crystal.rotation.x = elapsed * 2 + idx;
          crystal.rotation.y = elapsed * 1.8;
          crystal.position.y = Math.sin(elapsed * 3 + idx) * 0.12;
        }
      });

      // Slowly drift particle universe
      particleSystem.rotation.y = elapsed * 0.02;

      // Update Camera based on Mode
      if (cameraModeRef.current === "orbit") {
        // Orbit around center of the curve
        const center = new THREE.Vector3(0, 3, -4);
        if (!isDragging) {
          orbitAzimuth += delta * 0.08; // Subtle slow cinematic drift
        }
        camera.position.x = center.x + orbitDistance * Math.sin(orbitPolar) * Math.sin(orbitAzimuth);
        camera.position.y = center.y + orbitDistance * Math.cos(orbitPolar);
        camera.position.z = center.z + orbitDistance * Math.sin(orbitPolar) * Math.cos(orbitAzimuth);
        camera.lookAt(center);
      } else if (cameraModeRef.current === "flight") {
        // Fly-Through Rollercoaster POV
        let currentP = flightProgressRef.current;
        if (isPlayingFlightRef.current) {
          const speed = 0.035 * flightSpeedRef.current;
          currentP += delta * speed;
          if (currentP > 1) {
            currentP = 0;
          }
          flightProgressRef.current = currentP;
          setFlightProgress(currentP);
        }

        const pointOnTrack = splineCurve.getPointAt(currentP);
        // Look ahead slightly on the curve
        const lookAheadP = Math.min(1, currentP + 0.04);
        const lookTarget = splineCurve.getPointAt(lookAheadP);

        // Position camera right above track
        camera.position.set(pointOnTrack.x, pointOnTrack.y + 1.2, pointOnTrack.z + 1.5);
        camera.lookAt(lookTarget.x, lookTarget.y + 0.6, lookTarget.z);

        // Update real-time metric readout
        const currentSec = currentP * (videoDurationSeconds || 30);
        const retY = Math.max(0, Math.min(100, (pointOnTrack.y + 0.5) / 7.5 * 100));
        setCurrentMetricState({
          timeSec: currentSec,
          retention: Math.round(retY * 10) / 10,
          delta: Math.round((retY - (curve[0]?.retention || 100)) * 10) / 10,
          status: retY > 80 ? "peak" : retY < 60 ? "drop" : "stable",
        });
      } else if (cameraModeRef.current === "isometric") {
        // Tactical Top-Down Isometric Angle
        camera.position.lerp(new THREE.Vector3(18, 26, 16), 0.05);
        camera.lookAt(0, 1, -4);
      }

      // Raycast hovering for milestone nodes
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);
      if (intersects.length > 0) {
        const hitKeyframe = (intersects[0].object as any).userData?.keyframe as VideoKeyframe;
        if (hitKeyframe && hitKeyframe !== hoveredKeyframe) {
          setHoveredKeyframe(hitKeyframe);
          container.style.cursor = "pointer";
        }
      } else {
        if (hoveredKeyframe) {
          setHoveredKeyframe(null);
          container.style.cursor = "default";
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 13. Handle Window Resize dynamically
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      container.removeEventListener("wheel", onWheel);

      // Clean GPU memory
      tubeGeo.dispose();
      tubeMat.dispose();
      curtainGeo.dispose();
      curtainMat.dispose();
      renderer.dispose();
    };
  }, [curve, sortedKeyframes, videoDurationSeconds]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#05050A] rounded-xs border border-white/10 transition-all duration-300 select-none ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[580px]"
      }`}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* Futuristic Cyber Vignette / Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-70" />
      <div className="absolute inset-0 pointer-events-none bg-scanlines opacity-10" />

      {/* Top Header Bar: Title, Modes, and Audio Toggles */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pointer-events-auto bg-linear-to-b from-[#05050A]/95 via-[#05050A]/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00F5D4] animate-pulse shadow-lg shadow-[#00F5D4]/50" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00F5D4]">
                Spatial Retention Lab
              </span>
              <span className="bg-white/10 text-[10px] font-mono font-bold text-neutral-300 px-2 py-0.5 rounded-xs border border-white/15">
                WebGL 3D
              </span>
            </div>
            <h3 className="font-display font-extrabold text-base md:text-lg text-white tracking-tight">
              3D Retention Rollercoaster & Cognitive Flight
            </h3>
          </div>
        </div>

        {/* View Mode Switcher Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-black/60 backdrop-blur-md border border-white/15 p-1 rounded-xs flex items-center gap-1">
            <button
              onClick={() => {
                setCameraMode("orbit");
                setIsPlayingFlight(false);
                playCyberSound(440, "sine");
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs flex items-center gap-1.5 transition-all ${
                cameraMode === "orbit"
                  ? "bg-[#00F5D4] text-black shadow-md shadow-[#00F5D4]/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Orbit Lab</span>
            </button>

            <button
              onClick={() => {
                setCameraMode("flight");
                setIsPlayingFlight(true);
                playCyberSound(523.25, "triangle");
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs flex items-center gap-1.5 transition-all ${
                cameraMode === "flight"
                  ? "bg-[#00F5D4] text-black shadow-md shadow-[#00F5D4]/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fly-Through POV</span>
            </button>

            <button
              onClick={() => {
                setCameraMode("isometric");
                setIsPlayingFlight(false);
                playCyberSound(659.25, "sine");
              }}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-xs flex items-center gap-1.5 transition-all ${
                cameraMode === "isometric"
                  ? "bg-[#00F5D4] text-black shadow-md shadow-[#00F5D4]/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tactical Radar</span>
            </button>
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xs border transition-all ${
              soundEnabled
                ? "bg-[#00F5D4]/20 border-[#00F5D4] text-[#00F5D4]"
                : "bg-black/60 border-white/15 text-neutral-400 hover:text-white"
            }`}
            title={soundEnabled ? "Mute Cybernetic Audio" : "Enable Cybernetic Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Expansion */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-black/60 border border-white/15 text-neutral-400 hover:text-white rounded-xs transition-all"
            title={isFullscreen ? "Exit Immersive View" : "Immersive Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Top-Right HUD Metric Ticker (Active in Flight Mode) */}
      <div className="absolute top-20 right-4 md:right-6 pointer-events-none">
        <div className="bg-black/80 backdrop-blur-md border border-white/15 p-3 rounded-xs flex flex-col gap-1 shadow-2xl min-w-[170px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>TIMECODE</span>
            <span className="text-[#00F5D4] font-bold">
              {(currentMetricState?.timeSec ?? 0).toFixed(1)}s / {(videoDurationSeconds || 30).toFixed(0)}s
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="font-display font-extrabold text-2xl text-white tracking-tight">
              {(currentMetricState?.retention ?? 100).toFixed(1)}%
            </span>
            <span
              className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded-xs ${
                currentMetricState?.status === "peak"
                  ? "text-emerald-400 bg-emerald-950/60 border border-emerald-500/30"
                  : currentMetricState?.status === "drop"
                  ? "text-rose-400 bg-rose-950/60 border border-rose-500/30"
                  : "text-neutral-300 bg-white/10"
              }`}
            >
              {currentMetricState?.status === "peak" ? "CREST" : currentMetricState?.status === "drop" ? "VALLEY" : "HOLD"}
            </span>
          </div>

          <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-linear-to-r from-[#00F5D4] to-[#7B2CBF] transition-all"
              style={{ width: `${((flightProgress || 0) * 100).toFixed(1)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hovered / Clicked Keyframe Holographic HUD Card */}
      {(hoveredKeyframe || selectedKeyframe) && (
        <div className="absolute top-20 left-4 md:left-6 max-w-sm pointer-events-auto animate-fadeIn">
          {(() => {
            const activeKf = hoveredKeyframe || selectedKeyframe!;
            return (
              <div className="bg-[#0A0A14]/90 backdrop-blur-xl border border-[#00F5D4]/40 p-4 rounded-xs shadow-2xl shadow-[#00F5D4]/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00F5D4] font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" />
                    Keyframe Milestone ({activeKf.timestamp})
                  </span>
                  <span className="text-xs font-mono font-bold bg-[#00F5D4] text-black px-2 py-0.5 rounded-xs">
                    Score: {activeKf.score || 85}
                  </span>
                </div>

                <h4 className="font-display font-bold text-white text-base mb-1">
                  {activeKf.label}
                </h4>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-3">
                  {activeKf.note}
                </p>

                {activeKf.brainActivation && (
                  <div className="text-[11px] font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 px-2.5 py-1 rounded-xs mb-3">
                    🧠 Trigger: {activeKf.brainActivation}
                  </div>
                )}

                {onOpenKeyframeInsight && (
                  <button
                    onClick={() => onOpenKeyframeInsight(activeKf)}
                    className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-2 text-xs font-mono font-bold rounded-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Inspect Neural Diagnostics</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00F5D4]" />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Bottom Floating Control Deck: Timeline Scrubbing & Keyframe Jump Markers */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-linear-to-t from-[#05050A]/95 via-[#05050A]/70 to-transparent pointer-events-auto">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {/* Keyframe Jump Markers Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-mono text-neutral-400 font-bold shrink-0 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#00F5D4]" /> Milestones:
            </span>
            {sortedKeyframes.map((kf, i) => {
              const sec = kf.timeInSeconds ?? parseTimestampToSeconds(kf.timestamp);
              const isCurrent = selectedKeyframe?.label === kf.label;
              return (
                <button
                  key={i}
                  onClick={() => handleJumpToKeyframe(kf)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition-all shrink-0 flex items-center gap-1.5 ${
                    isCurrent
                      ? "bg-[#00F5D4] text-black border-[#00F5D4] font-bold shadow-md shadow-[#00F5D4]/30"
                      : "bg-black/50 text-neutral-300 border-white/15 hover:border-[#00F5D4]/60 hover:text-white"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{kf.timestamp}</span>
                  <span className="text-[10px] opacity-80 truncate max-w-[100px]">{kf.label}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Flight Scrubber */}
          <div className="bg-black/70 backdrop-blur-md border border-white/15 p-2.5 rounded-xs flex items-center gap-4">
            {/* Play / Pause Flight */}
            <button
              onClick={() => {
                if (cameraMode !== "flight") {
                  setCameraMode("flight");
                }
                setIsPlayingFlight(!isPlayingFlight);
                playCyberSound(isPlayingFlight ? 330 : 660, "sine");
              }}
              className="bg-[#00F5D4] hover:brightness-110 text-black p-2 rounded-xs flex items-center justify-center transition-all shadow-md shadow-[#00F5D4]/20 shrink-0"
              title={isPlayingFlight ? "Pause Camera Flight" : "Play Continuous Camera Flight"}
            >
              {isPlayingFlight ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
            </button>

            {/* Reset to Start */}
            <button
              onClick={() => {
                setFlightProgress(0);
                flightProgressRef.current = 0;
                playCyberSound(440, "sine");
              }}
              className="p-2 text-neutral-400 hover:text-white rounded-xs border border-white/10 transition-all shrink-0"
              title="Reset to 00:00"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Progress Slider */}
            <div className="flex-1 flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-400 w-12 text-right shrink-0">
                {(((flightProgress || 0) * (videoDurationSeconds || 30)) || 0).toFixed(1)}s
              </span>
              <div className="relative flex-1 group py-1">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.002}
                  value={flightProgress}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setFlightProgress(val);
                    flightProgressRef.current = val;
                    if (cameraMode !== "flight") {
                      setCameraMode("flight");
                    }
                  }}
                  className="w-full accent-[#00F5D4] cursor-pointer h-1.5 bg-white/20 rounded-full appearance-none focus:outline-hidden"
                />
              </div>
              <span className="text-xs font-mono text-neutral-400 w-12 shrink-0">
                {(videoDurationSeconds || 30).toFixed(0)}s
              </span>
            </div>

            {/* Speed Multiplier */}
            <button
              onClick={() => {
                const nextSpeed = flightSpeed === 1 ? 2 : 1;
                setFlightSpeed(nextSpeed);
                playCyberSound(nextSpeed === 2 ? 880 : 440, "sine");
              }}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-white rounded-xs transition-all shrink-0"
              title="Toggle Flight Speed"
            >
              {flightSpeed}x Speed
            </button>
          </div>
        </div>
      </div>

      {/* Orbit Tip Pill */}
      {cameraMode === "orbit" && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-white/15 text-neutral-300 text-[11px] font-mono px-3 py-1 rounded-full flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-[#00F5D4] animate-spin" />
            <span>Click & Drag to Orbit 360° • Scroll to Zoom</span>
          </div>
        </div>
      )}
    </div>
  );
};
