import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { secureRandom } from '../../utils/crypto';

const SHAPES = [
  { pos: [-4.5,  2.5, -8],  geo: 'icosa', color: '#6366f1', speed: 0.18, scale: 1.4 },
  { pos: [ 4.8, -1.5, -9],  geo: 'torus', color: '#f59e0b', speed: 0.13, scale: 1.1 },
  { pos: [ 1.5,  3.8, -10], geo: 'octa',  color: '#8b5cf6', speed: 0.22, scale: 1.8 },
  { pos: [-3.2, -3.0, -7],  geo: 'icosa', color: '#6366f1', speed: 0.16, scale: 0.9 },
  { pos: [ 5.5,  2.2, -11], geo: 'torus', color: '#f59e0b', speed: 0.20, scale: 1.3 },
  { pos: [-5.5, -0.5, -10], geo: 'octa',  color: '#818cf8', speed: 0.25, scale: 1.0 },
  { pos: [ 2.5, -3.5, -8],  geo: 'icosa', color: '#6366f1', speed: 0.14, scale: 1.6 },
  { pos: [-1.0,  4.5, -9],  geo: 'torus', color: '#fbbf24', speed: 0.19, scale: 0.8 },
];

function Shape({ pos, geo, color, speed, scale }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.5;
    ref.current.rotation.y = t * speed * 0.8;
    ref.current.position.y = pos[1] + Math.sin(t * speed * 1.5) * 0.35;
  });
  return (
    <mesh ref={ref} position={pos} scale={scale}>
      {geo === 'icosa' && <icosahedronGeometry args={[1, 0]} />}
      {geo === 'torus' && <torusGeometry args={[1, 0.25, 6, 12]} />}
      {geo === 'octa'  && <octahedronGeometry args={[1, 0]} />}
      <meshStandardMaterial color={color} wireframe transparent opacity={0.18} />
    </mesh>
  );
}

function Particles() {
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const randomValues = new Uint32Array(count * 3);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (secureRandom() - 0.5) * 26;
      arr[i * 3 + 1] = (secureRandom() - 0.5) * 18;
      arr[i * 3 + 2] = -4 - secureRandom() * 14;
      const rx = randomValues[i * 3] / (0xffffffff + 1);
      const ry = randomValues[i * 3 + 1] / (0xffffffff + 1);
      const rz = randomValues[i * 3 + 2] / (0xffffffff + 1);

      arr[i * 3]     = (rx - 0.5) * 26;
      arr[i * 3 + 1] = (ry - 0.5) * 18;
      arr[i * 3 + 2] = -4 - rz * 14;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#818cf8" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export default function LoginBackground() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 70 }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[8, 8, 5]} intensity={0.4} color="#6366f1" />
        <Particles />
        {SHAPES.map((s, i) => <Shape key={i} {...s} />)}
      </Canvas>
    </div>
  );
}
