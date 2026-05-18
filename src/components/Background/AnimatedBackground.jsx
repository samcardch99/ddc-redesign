import { useEffect, useRef } from "react";
import * as THREE from "three";

const AnimatedBackground = ({ className = "" }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const spheresRef = useRef([]);
  const cameraRef = useRef(null);
  const resizeObsRef = useRef(null);
  const rafRef = useRef(null);
  const lockedHRef = useRef(null);
  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia?.("(pointer: coarse)")?.matches;

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    const container = mountEl.parentElement;
    container.style.position = container.style.position || "relative";

    // ===== Helpers de tamaño =====
    const svh = () => {
      // aproximación práctica a 100svh (mínimo alto estable)
      const d = document.documentElement;
      return Math.min(window.innerHeight, d.clientHeight);
    };
    const getWidth = () => container.clientWidth || window.innerWidth;

    // Lock inicial del alto en mobile; en desktop usamos el del contenedor
    if (isMobile) {
      lockedHRef.current = svh();
      // evitar cambios visuales por barras dinámicas
      mountEl.style.height = "100svh";
    } else {
      lockedHRef.current = container.clientHeight || window.innerHeight;
      mountEl.style.height = "100%";
    }

    let w = getWidth();
    let h = lockedHRef.current;

    // ===== Three.js =====
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 7;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    rendererRef.current = renderer;
    mountEl.appendChild(renderer.domElement);

    // blur visual según ancho (no alto)
    const breakpoints = { sm: 640, md: 2100, lg: 3200 };
    const getBlur = (vw) =>
      vw < breakpoints.sm
        ? 66
        : vw < breakpoints.md
          ? 106
          : vw > breakpoints.lg
            ? 530
            : 106;
    const getRadius = (vw) =>
      vw < breakpoints.sm
        ? 1.2
        : vw < breakpoints.md
          ? 2.2
          : vw > breakpoints.lg
            ? 3.3
            : 2.2;
    mountEl.style.filter = `blur(${getBlur(w)}px) brightness(0.1)`;
    mountEl.style.opacity = "0.6";

    // Geometría
    const geometry = new THREE.SphereGeometry(getRadius(w), 8, 8);
    const baseMat = new THREE.MeshBasicMaterial({
      color: "#162d57",
      transparent: true,
      opacity: 1,
    });

    const spheres = [];
    const qty = w < 600 ? 10 : 5;
    for (let i = 0; i < qty; i++) {
      const mesh = new THREE.Mesh(geometry, baseMat.clone());
      mesh.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * (w < 600 ? 10 : 5)
      );
      mesh.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * 0.03,
        (Math.random() - 0.5) * (w < 600 ? 0.2 : 0.017)
      );

      const maxScale = 1,
        minScale = 0.4,
        maxZ = 10;
      const distanceFromCamera = Math.abs(mesh.position.z);
      const scaleFactor = THREE.MathUtils.clamp(
        1 - distanceFromCamera / maxZ,
        minScale,
        maxScale
      );
      mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

      scene.add(mesh);
      spheres.push(mesh);
    }
    spheresRef.current = spheres;

    // Animación
    const animate = () => {
      spheres.forEach((s) => {
        const v = s.userData.velocity;
        s.position.add(v);
        const limit = 6;
        if (s.position.x > limit || s.position.x < -limit) {
          v.x *= -1;
          s.position.x = THREE.MathUtils.clamp(s.position.x, -limit, limit);
        }
        if (s.position.y > limit || s.position.y < -limit) {
          v.y *= -1;
          s.position.y = THREE.MathUtils.clamp(s.position.y, -limit, limit);
        }
        if (s.position.z > limit || s.position.z < -limit) {
          v.z *= -1;
          s.position.z = THREE.MathUtils.clamp(s.position.z, -limit, limit);
        }

        const distance = s.position.distanceTo(camera.position);
        const maxDistance = 5,
          minDistance = 1,
          strength = 2;
        const normalized = THREE.MathUtils.clamp(
          (distance - minDistance) / (maxDistance - minDistance),
          0,
          1
        );
        const deform = 1 + (1 - normalized) * strength;
        s.scale.set(deform, 1 / deform, deform);
        s.material.opacity = normalized < 1 ? Math.pow(normalized, 3) : 1;
      });

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    // ===== Resize: ignorar alto en mobile =====
    const onContainerResize = (entries) => {
      const entry = entries[0];
      // Sólo reacciona a cambios de ANCHO
      const inlineSize =
        (entry.contentBoxSize &&
          (Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0].inlineSize
            : entry.contentBoxSize.inlineSize)) ||
        container.clientWidth;

      if (Math.round(inlineSize) !== Math.round(w)) {
        w = inlineSize;
        const hLocked = lockedHRef.current; // alto congelado
        camera.aspect = w / hLocked;
        camera.updateProjectionMatrix();
        renderer.setSize(w, hLocked);
        mountEl.style.filter = `blur(${getBlur(w)}px) brightness(1)`;
      }
    };

    const ro = new ResizeObserver(onContainerResize);
    ro.observe(container);
    resizeObsRef.current = ro;

    // Rotación: recalcular lock SOLO en mobile (para no quedar estirado)
    const onOrientation = () => {
      if (!isMobile) return;
      // recalcula bloqueo con un pequeño delay por animación de UI
      setTimeout(() => {
        lockedHRef.current = svh();
        const hLocked = lockedHRef.current;
        w = getWidth();
        camera.aspect = w / hLocked;
        camera.updateProjectionMatrix();
        renderer.setSize(w, hLocked);
      }, 250);
    };
    window.addEventListener("orientationchange", onOrientation);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObsRef.current?.disconnect?.();
      window.removeEventListener("orientationchange", onOrientation);

      spheresRef.current.forEach((m) => {
        m.geometry?.dispose();
        m.material?.dispose();
      });
      renderer.dispose();
      mountEl.removeChild(renderer.domElement);
    };
  }, [isMobile]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: -20,
        overflow: "hidden",
        // altura estable; en móvil usamos svh para evitar “saltos” de la barra
        height: "100svh",
      }}
      className={className}
    />
  );
};

export default AnimatedBackground;
