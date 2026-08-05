import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { BrainRegionKey, BrainRegionsActivation } from "../types";
import { BRAIN_REGIONS, getFMRIColor } from "../data/brainRegions";
import { RotateCcw, Pause, Play, Layers, Sparkles, HelpCircle, Camera } from "lucide-react";

interface BrainMap3DProps {
  activations: BrainRegionsActivation;
  onOpenKeyframeInsight?: (regionKey?: BrainRegionKey) => void;
}

export const BrainMap3D: React.FC<BrainMap3DProps> = ({ activations, onOpenKeyframeInsight }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<BrainRegionKey | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<BrainRegionKey | null>("prefrontal");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  useEffect(() => {
    if (viewMode !== "3d" || !mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0d0d0d");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Clear old canvases
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf5e642, 0.4);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Brain Group
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Wireframe Brain Outer Shell (Icosahedron)
    const wireframeGeo = new THREE.IcosahedronGeometry(1.2, 3);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xf5e642,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    brainGroup.add(wireframeMesh);

    // Mid-sagittal Fissure Line
    const fissureGeo = new THREE.BufferGeometry();
    const fissurePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      fissurePoints.push(new THREE.Vector3(0, Math.sin(theta) * 1.18, Math.cos(theta) * 1.18));
    }
    fissureGeo.setFromPoints(fissurePoints);
    const fissureMat = new THREE.LineBasicMaterial({
      color: 0xe8281a,
      transparent: true,
      opacity: 0.4,
    });
    const fissureLine = new THREE.Line(fissureGeo, fissureMat);
    brainGroup.add(fissureLine);

    // 14 Brain Region Nodes
    const nodeMeshes: { mesh: THREE.Mesh; key: BrainRegionKey }[] = [];

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
        emissiveIntensity: 0.3 + (actVal / 100) * 0.4,
        roughness: 0.2,
        metalness: 0.1,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(...info.position);
      sphereMesh.userData = { key: regionKey, info, val: actVal };

      brainGroup.add(sphereMesh);
      nodeMeshes.push({ mesh: sphereMesh, key: regionKey });

      // Outer glowing ring for high-activation nodes (> 70)
      if (actVal > 70) {
        const ringGeo = new THREE.RingGeometry(radius * 1.2, radius * 1.4, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(colorHex),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(...info.position);
        ringMesh.lookAt(camera.position);
        brainGroup.add(ringMesh);
      }
    });

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
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotatingRef.current && !isMouseDown) {
        brainGroup.rotation.y += 0.004;
      }

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

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-sm p-6 shadow-xs">
      <div className="border-b border-[#E5E5E5] pb-4 mb-6 flex flex-wrap justify-between items-center gap-3">
        <div>
          <span className="text-xs font-mono font-bold text-[#111111] uppercase tracking-wider">
            3D Computational fMRI Model
          </span>
          <h2 className="font-display font-extrabold text-2xl text-[#111111] mt-1">
            14 Brain Region Activation Map
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
            className="bg-white border border-[#E5E5E5] text-[#111111] hover:border-[#111111] px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{viewMode === "3d" ? "Matrix View" : "3D Canvas"}</span>
          </button>

          {viewMode === "3d" && (
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="bg-[#111111] text-white hover:bg-black px-3 py-2 text-xs font-semibold rounded-sm flex items-center gap-1.5 transition-colors"
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
          {/* 3D Canvas */}
          <div className="lg:col-span-2 relative bg-[#111111] border border-[#E5E5E5] rounded-sm h-[450px] overflow-hidden shadow-xs">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

            {/* Instruction Banner */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white border border-white/20 px-3 py-1.5 text-xs font-mono rounded-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Drag to rotate • Click nodes to inspect fMRI metrics</span>
            </div>

            {/* fMRI Heat Legend */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-xs text-white border border-white/20 p-2.5 text-xs font-mono rounded-xs">
              <span className="block text-white/70 font-bold mb-1 uppercase text-[10px]">fMRI Activation Heat Scale</span>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-2 bg-gradient-to-r from-neutral-800 via-neutral-400 to-white rounded-xs border border-white/20" />
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
                <span className="text-[10px] font-mono font-bold bg-[#111111] text-white px-2.5 py-0.5 rounded-xs uppercase">
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

              <div className="bg-white border border-[#E5E5E5] rounded-xs p-3.5 mb-4 text-xs font-sans text-[#333333] leading-relaxed">
                {activeInfo?.description}
              </div>

              <div className="space-y-2 mt-4">
                <span className="text-[10px] font-mono uppercase font-bold text-[#444444] block">
                  Quick Select Brain Region:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 border border-[#E5E5E5] bg-white rounded-xs">
                  {Object.entries(BRAIN_REGIONS).map(([key, info]) => {
                    const rKey = key as BrainRegionKey;
                    const val = activations?.[rKey] ?? 0;
                    const isSel = rKey === activeDisplayRegionKey;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedRegion(rKey)}
                        className={`text-[10px] font-mono font-bold px-2 py-1 rounded-xs border transition-colors ${
                          isSel
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-[#F4F4F4] hover:bg-[#111111] hover:text-white text-[#111111] border-[#E5E5E5]"
                        }`}
                      >
                        {info.label.split(" ")[0]} ({val})
                      </button>
                    );
                  })}
                </div>
              </div>

              {onOpenKeyframeInsight && (
                <button
                  onClick={() => onOpenKeyframeInsight(activeDisplayRegionKey)}
                  className="w-full mt-4 bg-[#111111] hover:bg-black text-white px-3.5 py-2.5 text-xs font-mono font-semibold rounded-xs flex items-center justify-center gap-2 transition-all shadow-xs group"
                >
                  <Camera className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                  <span>Keyframe Insight (Inspect Video Frame)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 2D Matrix Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(BRAIN_REGIONS).map(([key, info]) => {
            const rKey = key as BrainRegionKey;
            const val = activations?.[rKey] ?? 0;
            const heatColor = getFMRIColor(val);

            return (
              <div
                key={key}
                onClick={() => {
                  setSelectedRegion(rKey);
                  if (onOpenKeyframeInsight) onOpenKeyframeInsight(rKey);
                }}
                className="bg-[#F4F4F4] border border-[#E5E5E5] rounded-sm p-3.5 hover:border-[#111111] cursor-pointer transition-colors shadow-xs group"
              >
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#111111] truncate group-hover:text-black transition-colors">
                    {info.label}
                  </span>
                  <span
                    className="font-display font-extrabold text-xs px-2 py-0.5 rounded-xs border border-black/10"
                    style={{ backgroundColor: heatColor, color: val > 65 ? "#ffffff" : "#111111" }}
                  >
                    {val}
                  </span>
                </div>
                <p className="text-[11px] font-sans text-[#333333] line-clamp-2 mb-2">
                  {info.description}
                </p>
                <div className="text-[10px] font-mono text-[#111111] font-bold flex items-center gap-1 opacity-70 group-hover:opacity-100">
                  <Camera className="w-3 h-3 text-[#111111]" />
                  <span>Inspect Keyframe Frame</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
