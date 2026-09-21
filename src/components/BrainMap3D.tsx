import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";
import { BrainRegionKey, BrainRegionsActivation, ViralityAnalysis } from "../types";
import { BRAIN_REGIONS, getFMRIColor } from "../data/brainRegions";
import { getRegionCorrelation } from "../utils/brainCorrelation";
import { BrainRegionNeuroModal } from "./BrainRegionNeuroModal";
import { RotateCcw, Pause, Play, Layers, Sparkles, HelpCircle, Camera, Zap, Info, ChevronRight, Activity, BookOpen } from "lucide-react";

interface BrainMap3DProps {
  activations: BrainRegionsActivation;
  analysis?: ViralityAnalysis;
  onOpenKeyframeInsight?: (regionKey?: BrainRegionKey) => void;
}

export const BrainMap3D: React.FC<BrainMap3DProps> = ({
  activations,
  analysis,
  onOpenKeyframeInsight,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<BrainRegionKey | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<BrainRegionKey | null>("prefrontal");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");
  const [neuroModalRegion, setNeuroModalRegion] = useState<BrainRegionKey | null>(null);

  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  useEffect(() => {
    if (viewMode !== "3d" || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#050508");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear old canvases
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Futuristic Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00F5D4, 1.2); // Electric Cyan
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x7B2CBF, 0.9); // Cyber Violet
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xFF0055, 0.6); // Signal Red
    dirLight3.position.set(0, -5, 5);
    scene.add(dirLight3);

    // Brain Group
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Particle Cloud Universe (Floating Synapses)
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x00F5D4);
    const colorB = new THREE.Color(0x7B2CBF);
    const colorC = new THREE.Color(0xFFB703);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.3 + Math.random() * 0.8;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      const mixColor = i % 3 === 0 ? colorA : i % 3 === 1 ? colorB : colorC;
      particleColors[i * 3] = mixColor.r;
      particleColors[i * 3 + 1] = mixColor.g;
      particleColors[i * 3 + 2] = mixColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    brainGroup.add(particlePoints);

    // Wireframe Brain Outer Shell (Icosahedron)
    const wireframeGeo = new THREE.IcosahedronGeometry(1.22, 3);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x00F5D4,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    brainGroup.add(wireframeMesh);

    // Inner Glassy Core Shell
    const coreGeo = new THREE.IcosahedronGeometry(1.15, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    brainGroup.add(coreMesh);

    // Mid-sagittal Fissure Line
    const fissureGeo = new THREE.BufferGeometry();
    const fissurePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      fissurePoints.push(new THREE.Vector3(0, Math.sin(theta) * 1.18, Math.cos(theta) * 1.18));
    }
    fissureGeo.setFromPoints(fissurePoints);
    const fissureMat = new THREE.LineBasicMaterial({
      color: 0xFF0055,
      transparent: true,
      opacity: 0.6,
    });
    const fissureLine = new THREE.Line(fissureGeo, fissureMat);
    brainGroup.add(fissureLine);

    // 14 Brain Region Nodes & Synaptic Connections
    const nodeMeshes: { mesh: THREE.Mesh; key: BrainRegionKey; baseScale: number }[] = [];
    const nodePositions: THREE.Vector3[] = [];

    Object.entries(BRAIN_REGIONS).forEach(([key, info]) => {
      const regionKey = key as BrainRegionKey;
      const actVal = activations?.[regionKey] ?? 50;

      // Size scaled by activation
      const radius = 0.08 + (actVal / 100) * 0.09;
      const sphereGeo = new THREE.SphereGeometry(radius, 24, 24);

      const colorHex = getFMRIColor(actVal);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: 0.4 + (actVal / 100) * 0.5,
        roughness: 0.15,
        metalness: 0.2,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      const posVec = new THREE.Vector3(...info.position);
      sphereMesh.position.copy(posVec);
      sphereMesh.userData = { key: regionKey, info, val: actVal };

      brainGroup.add(sphereMesh);
      nodeMeshes.push({ mesh: sphereMesh, key: regionKey, baseScale: 1.0 });
      nodePositions.push(posVec);

      // Outer glowing ring for high-activation nodes (> 65)
      if (actVal > 65) {
        const ringGeo = new THREE.RingGeometry(radius * 1.25, radius * 1.45, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(colorHex),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.65,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(posVec);
        ringMesh.lookAt(camera.position);
        brainGroup.add(ringMesh);
      }
    });

    // Synaptic Connection Network Lines between nodes
    const lineIndices: number[] = [];
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 1.4) {
          lineIndices.push(i, j);
        }
      }
    }

    const synapseGeo = new THREE.BufferGeometry();
    const synapsePositions = new Float32Array(lineIndices.length * 3);
    for (let i = 0; i < lineIndices.length; i++) {
      const nodeIdx = lineIndices[i];
      synapsePositions[i * 3] = nodePositions[nodeIdx].x;
      synapsePositions[i * 3 + 1] = nodePositions[nodeIdx].y;
      synapsePositions[i * 3 + 2] = nodePositions[nodeIdx].z;
    }
    synapseGeo.setAttribute('position', new THREE.BufferAttribute(synapsePositions, 3));

    const synapseMat = new THREE.LineBasicMaterial({
      color: 0x00F5D4,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending
    });
    const synapseLines = new THREE.LineSegments(synapseGeo, synapseMat);
    brainGroup.add(synapseLines);

    // Mouse Interaction / Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let isMouseDown = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent) => {
      isMouseDown = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isMouseDown) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        brainGroup.rotation.y += deltaX * 0.008;
        brainGroup.rotation.x += deltaY * 0.008;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        // Raycast hover check
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(
          nodeMeshes.map((n) => n.mesh)
        );
        if (intersects.length > 0) {
          const hoveredKey = intersects[0].object.userData.key as BrainRegionKey;
          setHoveredRegion(hoveredKey);
        } else {
          setHoveredRegion(null);
        }
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        nodeMeshes.map((n) => n.mesh)
      );
      if (intersects.length > 0) {
        const clickedKey = intersects[0].object.userData.key as BrainRegionKey;
        setSelectedRegion(clickedKey);
      }
    };

    const domElem = mountRef.current;
    domElem.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    domElem.addEventListener("click", handleClick);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotatingRef.current && !isMouseDown) {
        brainGroup.rotation.y += 0.003;
      }

      // Gentle particle cloud drift
      particlePoints.rotation.y = elapsedTime * -0.05;

      // Pulse high-activation nodes
      nodeMeshes.forEach(({ mesh }) => {
        const val = mesh.userData.val || 50;
        if (val > 60) {
          const pulse = 1 + Math.sin(elapsedTime * 3 + val) * 0.08;
          mesh.scale.set(pulse, pulse, pulse);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      domElem.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [viewMode, activations]);

  const activeDisplayRegionKey = hoveredRegion || selectedRegion || "prefrontal";
  const activeInfo = BRAIN_REGIONS[activeDisplayRegionKey];
  const activeScore = activations?.[activeDisplayRegionKey] ?? 0;
  const correlation = getRegionCorrelation(activeDisplayRegionKey, activeScore, analysis);

  const getHeatLabel = (score: number) => {
    if (score >= 85) return "Hot Spike (Viral Driver)";
    if (score >= 65) return "Moderate Engagement";
    if (score >= 35) return "Mild Response";
    return "Low Activation";
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 mb-6 flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-pink-500" />
            3D Computational fMRI Model
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            14 Brain Region Activation Map
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNeuroModalRegion(activeDisplayRegionKey)}
            className="bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 px-3 py-2 text-xs font-mono font-bold rounded-sm flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            title="Read detailed neuroscience role in virality prediction"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span>Neuroscience Virality Guide</span>
          </button>

          <button
            onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
            className="bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#111111] px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === "3d" ? "Matrix View" : "3D Canvas"}</span>
          </button>

          {viewMode === "3d" && (
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="bg-[#111111] text-white hover:bg-black px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Toggle 3D auto rotation"
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isAutoRotating ? "Pause Orbit" : "Rotate"}</span>
            </button>
          )}
        </div>
      </div>

      {viewMode === "3d" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* 3D Canvas Container */}
          <div className="lg:col-span-2 relative bg-[#0B0C0E] border border-[#E5E5E5] rounded-sm h-[480px] overflow-hidden shadow-xs group">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Instruction Banner */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white border border-white/20 px-3 py-1.5 text-xs font-mono rounded-xs flex items-center gap-2 z-10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Drag to orbit • Hover node for video correlation</span>
            </div>

            {/* Interactive Floating Tooltip Overlay directly on 3D Canvas */}
            <div className="absolute top-12 left-3 right-3 sm:right-auto sm:max-w-md bg-neutral-900/95 backdrop-blur-md border border-neutral-700 text-white p-3.5 rounded-sm shadow-2xl z-20 pointer-events-auto transition-all animate-fade-in">
              <div className="flex justify-between items-start gap-2 mb-1.5 border-b border-neutral-800 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0 animate-pulse"
                      style={{ backgroundColor: getFMRIColor(activeScore) }}
                    />
                    <h4 className="font-display font-bold text-sm text-white">
                      {activeInfo?.label}
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
                    {activeInfo?.sublabel}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-xs border border-white/10"
                    style={{ backgroundColor: getFMRIColor(activeScore), color: activeScore > 65 ? "#ffffff" : "#111111" }}
                  >
                    {activeScore}/100
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 block mt-0.5 uppercase font-semibold">
                    {getHeatLabel(activeScore)}
                  </span>
                </div>
              </div>

              {/* Biological Function */}
              <div className="mb-2">
                <span className="text-[9px] font-mono uppercase text-neutral-400 font-bold block mb-0.5">
                  🧠 Neural Function
                </span>
                <p className="text-xs text-neutral-200 font-sans leading-snug">
                  {activeInfo?.description}
                </p>
              </div>

              {/* Input Video Correlation Section */}
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xs p-2.5 mb-2.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] font-bold uppercase mb-1">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Input Video Correlation</span>
                </div>
                <p className="text-xs font-sans text-amber-100 leading-snug">
                  {correlation.correlationSummary}
                </p>
                <div className="mt-1.5 pt-1.5 border-t border-amber-500/20 flex flex-wrap items-center justify-between text-[10px] font-mono text-amber-300">
                  <span className="truncate max-w-[200px]">⚡ {correlation.primaryCatalyst}</span>
                  {correlation.keyframeTimestamp && (
                    <span className="font-bold text-amber-200 bg-amber-900/60 px-1.5 py-0.2 rounded-xs">
                      Keyframe @ {correlation.keyframeTimestamp}
                    </span>
                  )}
                </div>
              </div>

              {/* Interactive Tooltip Actions */}
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
                <button
                  onClick={() => setNeuroModalRegion(activeDisplayRegionKey)}
                  className="px-2 py-1 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Neuroscience Role</span>
                </button>
                {onOpenKeyframeInsight && (
                  <button
                    onClick={() => onOpenKeyframeInsight(activeDisplayRegionKey)}
                    className="px-2 py-1 bg-white text-black font-bold rounded-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Inspect Frame</span>
                  </button>
                )}
              </div>
            </div>

            {/* fMRI Heat Legend */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-xs text-white border border-white/20 p-2.5 text-xs font-mono rounded-xs z-10">
              <span className="block text-white/70 font-bold mb-1 uppercase text-[10px]">fMRI Activation Heat Scale</span>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-2 bg-gradient-to-r from-blue-500 via-yellow-400 to-red-600 rounded-xs border border-white/20" />
              </div>
              <div className="flex justify-between text-[10px] text-white/60 mt-1 font-mono">
                <span>0 Cold</span>
                <span>35 Mild</span>
                <span>65 Moderate</span>
                <span className="text-white font-bold">100 Hot Spike</span>
              </div>
            </div>
          </div>

          {/* Region Inspector Card */}
          <div className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono font-bold bg-[#111111] text-white px-2.5 py-0.5 rounded-xs uppercase tracking-wider">
                  INSPECTED REGION
                </span>
                <span className="text-2xl font-display font-extrabold text-[#111111]">
                  {activeScore} <span className="text-xs text-[#555555] font-mono font-semibold">/100</span>
                </span>
              </div>

              <h3 className="font-display font-bold text-xl text-[#111111] mb-0.5">
                {activeInfo?.label}
              </h3>
              <p className="text-xs font-mono font-bold text-[#444444] mb-3">
                {activeInfo?.sublabel}
              </p>

              {/* Neural Function */}
              <div className="bg-white border border-[#E5E5E5] rounded-xs p-3 mb-3 text-xs font-sans text-[#333333] leading-relaxed">
                <span className="font-mono text-[10px] font-bold text-neutral-500 uppercase block mb-1">
                  Biological Role:
                </span>
                {activeInfo?.description}
              </div>

              {/* Detailed Video Correlation Breakdown */}
              <div className="bg-white border border-amber-200 rounded-xs p-3 mb-4 text-xs font-sans text-[#333333]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-600" />
                    Input Video Correlation:
                  </span>
                  {correlation.keyframeTimestamp && (
                    <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-xs">
                      {correlation.keyframeTimestamp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed mb-2">
                  {correlation.correlationSummary}
                </p>

                <div className="pt-2 border-t border-neutral-200">
                  <span className="font-mono text-[10px] font-bold text-neutral-600 uppercase block mb-0.5">
                    Optimization Recommendation:
                  </span>
                  <p className="text-[11px] font-mono text-neutral-700 bg-neutral-50 p-2 rounded-xs border border-neutral-200">
                    💡 {correlation.optimizationTip}
                  </p>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="space-y-2 mt-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#444444] block">
                  Select Region to Inspect:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 border border-[#E5E5E5] bg-white rounded-xs">
                  {Object.entries(BRAIN_REGIONS).map(([key, info]) => {
                    const rKey = key as BrainRegionKey;
                    const val = activations?.[rKey] ?? 0;
                    const isSel = rKey === activeDisplayRegionKey;
                    return (
                      <motion.button
                        key={key}
                        onClick={() => setSelectedRegion(rKey)}
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 25 }}
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded-xs border transition-colors cursor-pointer ${
                          isSel
                            ? "bg-[#111111] text-white border-[#111111] shadow-xs"
                            : "bg-[#F4F4F4] hover:bg-[#111111] hover:text-white text-[#111111] border-[#E5E5E5]"
                        }`}
                      >
                        {(info?.label || key).split(" ")[0]} ({val})
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Neuroscience Explanation & Keyframe */}
              <div className="mt-4 space-y-2">
                <motion.button
                  onClick={() => setNeuroModalRegion(activeDisplayRegionKey)}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black px-3.5 py-2.5 text-xs font-mono font-bold rounded-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-black" />
                  <span>Neuroscience Virality Role ({(activeInfo?.label || activeDisplayRegionKey || "").split(" ")[0]})</span>
                </motion.button>

                {onOpenKeyframeInsight && (
                  <motion.button
                    onClick={() => onOpenKeyframeInsight(activeDisplayRegionKey)}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-full bg-[#111111] hover:bg-black text-white px-3.5 py-2 text-xs font-mono font-semibold rounded-xs flex items-center justify-center gap-2 transition-all shadow-xs group cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform" />
                    <span>Inspect Frame Keyframe ({correlation.keyframeTimestamp || "00:00.5"})</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2D Matrix Grid View with Framer Motion hover animations */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(BRAIN_REGIONS).map(([key, info]) => {
            const rKey = key as BrainRegionKey;
            const val = activations?.[rKey] ?? 0;
            const heatColor = getFMRIColor(val);
            const rCorr = getRegionCorrelation(rKey, val, analysis);

            return (
              <motion.div
                key={key}
                onClick={() => {
                  setSelectedRegion(rKey);
                  setNeuroModalRegion(rKey);
                }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 26 }}
                className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm p-3.5 hover:border-[#111111] hover:shadow-md cursor-pointer transition-all shadow-xs group relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#111111] truncate group-hover:text-black transition-colors">
                      {info.label}
                    </span>
                    <span
                      className="font-display font-extrabold text-xs px-2 py-0.5 rounded-xs border border-black/10 shrink-0"
                      style={{ backgroundColor: heatColor, color: val > 65 ? "#ffffff" : "#111111" }}
                    >
                      {val}
                    </span>
                  </div>
                  <p className="text-[11px] font-sans text-[#333333] line-clamp-2 mb-2">
                    {info.description}
                  </p>

                  {/* Correlation snippet in 2D card */}
                  <div className="bg-white border border-neutral-200 p-2 rounded-xs mb-2">
                    <span className="font-mono text-[9px] font-bold text-amber-700 block mb-0.5 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" /> Video Correlation:
                    </span>
                    <p className="text-[10px] font-sans text-neutral-700 line-clamp-2">
                      {rCorr.correlationSummary}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5E5E5] flex items-center justify-between gap-1 text-[10px] font-mono">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRegion(rKey);
                      setNeuroModalRegion(rKey);
                    }}
                    className="text-amber-800 hover:text-black font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-amber-600" />
                    <span>Neuroscience</span>
                  </button>

                  {onOpenKeyframeInsight && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRegion(rKey);
                        onOpenKeyframeInsight(rKey);
                      }}
                      className="text-neutral-700 hover:text-black font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3 h-3" />
                      <span>{rCorr.keyframeTimestamp || "Frame"}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Neuroscience Explanation Overlay Modal */}
      <BrainRegionNeuroModal
        isOpen={!!neuroModalRegion}
        regionKey={neuroModalRegion}
        activations={activations}
        analysis={analysis}
        onClose={() => setNeuroModalRegion(null)}
        onSelectRegion={(k) => {
          setSelectedRegion(k);
          setNeuroModalRegion(k);
        }}
        onOpenKeyframeInsight={(k) => {
          if (onOpenKeyframeInsight) onOpenKeyframeInsight(k);
        }}
      />
    </div>
  );
};

