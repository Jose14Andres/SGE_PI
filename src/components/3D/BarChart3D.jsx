import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

function Bar({ x, targetH, color, label, value, delay }) {
  const meshRef = useRef();
  const progress = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }, delta) => {
    if (clock.elapsedTime > delay) {
      progress.current = Math.min(progress.current + delta * 2, 1);
    }
    const s = progress.current;
    meshRef.current.scale.y = Math.max(s, 0.001);
    meshRef.current.position.y = (targetH * s) / 2;
  });

  const shortLabel = label.length > 12 ? label.slice(0, 11) + '…' : label;

  return (
    <group position={[x, 0, 0]}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <boxGeometry args={[0.58, targetH, 0.58]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={hovered ? 0.95 : 0.80}
          emissive={color}
          emissiveIntensity={hovered ? 0.55 : 0.18}
        />
      </mesh>

      {hovered && (
        <Html position={[0, targetH + 0.5, 0]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(15,23,42,0.92)',
            border: `1px solid ${color}66`,
            borderRadius: 6,
            padding: '4px 10px',
            color: '#e2e8f0',
            fontSize: 11,
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(8px)',
            pointerEvents: 'none',
          }}>
            <span style={{ color, fontWeight: 700 }}>{value}</span> alumnos
          </div>
        </Html>
      )}

      <Html position={[0, -0.35, 0]} center distanceFactor={8}>
        <div style={{
          color: '#64748b',
          fontSize: 9,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          pointerEvents: 'none',
          maxWidth: 72,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {shortLabel}
        </div>
      </Html>
    </group>
  );
}

function ChartScene({ data }) {
  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const MAX_H = 3.5;
  const spacing = 1.35;
  const totalW = (data.length - 1) * spacing;

  return (
    <>
      <ambientLight intensity={0.75} />
      <pointLight position={[4, 9, 5]} intensity={0.9} color="#6366f1" />
      <pointLight position={[-4, 5, -3]} intensity={0.5} color="#f59e0b" />
      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={16}
        target={[0, 1, 0]}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2.15}
      />
      <gridHelper args={[16, 16, '#1e293b', '#1e293b']} position={[0, 0, 0]} />
      {data.map((d, i) => {
        const x = -totalW / 2 + i * spacing;
        const targetH = (d.value / maxVal) * MAX_H + 0.06;
        return (
          <Bar
            key={d.label}
            x={x}
            targetH={targetH}
            color={PALETTE[i % PALETTE.length]}
            label={d.label}
            value={d.value}
            delay={i * 0.12}
          />
        );
      })}
    </>
  );
}

export default function BarChart3D({ data }) {
  return (
    <div style={{ height: 300, width: '100%', cursor: 'grab' }}>
      <Canvas
        camera={{ position: [0, 4, 10], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <ChartScene data={data} />
        </Suspense>
      </Canvas>
    </div>
  );
}
