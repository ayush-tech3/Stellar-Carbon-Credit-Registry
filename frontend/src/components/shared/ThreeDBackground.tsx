"use client";

import React, { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  pulseSpeed: number;
  pulseVal: number;
}

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse tracking for 3D parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / width - 0.5) * 2;
      mouseY = (e.clientY / height - 0.5) * 2;
      targetRotY = mouseX * 0.35;
      targetRotX = -mouseY * 0.35;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize 3D nodes
    const nodeCount = Math.min(65, Math.floor((width * height) / 18000));
    const nodes: Node3D[] = [];
    const colors = [
      "rgba(16, 185, 129, ", // Emerald
      "rgba(20, 184, 166, ", // Teal
      "rgba(6, 182, 212, ",  // Cyan
      "rgba(52, 211, 153, ", // Light Emerald
    ];

    const fov = 400;
    const depthRange = 600;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: (Math.random() - 0.5) * depthRange,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        vz: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulseVal: Math.random() * Math.PI * 2,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera rotation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Projected points
      const projected: { px: number; py: number; pz: number; scale: number; node: Node3D }[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Move
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;

        // Wrap around bounds
        const boundX = width * 0.7;
        const boundY = height * 0.7;
        const boundZ = depthRange * 0.5;

        if (n.x < -boundX) n.x = boundX;
        if (n.x > boundX) n.x = -boundX;
        if (n.y < -boundY) n.y = boundY;
        if (n.y > boundY) n.y = -boundY;
        if (n.z < -boundZ) n.z = boundZ;
        if (n.z > boundZ) n.z = -boundZ;

        // 3D rotation matrix
        // Rotate Y
        const x1 = n.x * cosY + n.z * sinY;
        const z1 = -n.x * sinY + n.z * cosY;
        // Rotate X
        const y2 = n.y * cosX - z1 * sinX;
        const z2 = n.y * sinX + z1 * cosX;

        // Perspective projection
        const zCamera = z2 + fov + 200;
        if (zCamera <= 0) continue;

        const scale = fov / zCamera;
        const px = x1 * scale + width / 2;
        const py = y2 * scale + height / 2;

        n.pulseVal += n.pulseSpeed;

        projected.push({ px, py, pz: z2, scale, node: n });
      }

      // Sort by depth (painters algorithm)
      projected.sort((a, b) => b.pz - a.pz);

      // Draw connection lines
      const maxDist = 160;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.px - p2.px;
          const dy = p1.py - p2.py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.22 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.lineWidth = 1 * Math.min(p1.scale, p2.scale);
            ctx.stroke();
          }
        }
      }

      // Draw 3D nodes with neon glow
      for (let i = 0; i < projected.length; i++) {
        const { px, py, scale, node } = projected[i];
        const pulse = 0.8 + 0.3 * Math.sin(node.pulseVal);
        const r = node.radius * scale * pulse;
        const alpha = Math.max(0.2, Math.min(0.9, scale * 1.1));

        // Glow ring
        ctx.beginPath();
        ctx.arc(px, py, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${alpha * 0.25})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${alpha})`;
        ctx.shadowColor = "rgba(16, 185, 129, 0.8)";
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-65"
      />
      {/* Ambient background glows */}
      <div className="absolute top-[-15%] left-[20%] w-[45vw] h-[45vw] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-[35vw] h-[35vw] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
