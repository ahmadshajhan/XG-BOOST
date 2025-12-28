'use client';

import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

interface ThreeBackgroundProps {
    zoom?: boolean;
}

function ParticleFlow(props: { zoom?: boolean }) {
    const ref = useRef<any>(null);

    // Create particles
    const [particles, setParticles] = useState<Float32Array | null>(null);

    useEffect(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Spread evenly in a wider space
            positions[i * 3] = (Math.random() - 0.5) * 10;     // x
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
        }
        setParticles(positions);
    }, []);

    useFrame((state) => {
        if (ref.current) {
            // Slow rotation
            ref.current.rotation.x -= 0.0005;
            ref.current.rotation.y -= 0.0005;

            // Subtle mouse interaction
            const { mouse } = state;
            const targetX = mouse.x * 0.1;
            const targetY = mouse.y * 0.1;

            ref.current.rotation.x += (targetY - ref.current.rotation.x) * 0.02;
            ref.current.rotation.y += (targetX - ref.current.rotation.y) * 0.02;
        }

        // Zoom Effect
        if (props.zoom) {
            state.camera.position.z -= 0.05;
            if (state.camera.position.z < -2) state.camera.position.z = -2;
        } else {
            // Reset or standard position logic if needed, but for now we just initialize at 3
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            {particles && (
                <Points ref={ref} positions={particles} stride={3} frustumCulled={false} {...props}>
                    <PointMaterial
                        transparent
                        color="#00FF94" // Neon Green
                        size={0.012}
                        sizeAttenuation={true}
                        depthWrite={false}
                        opacity={0.8}
                    />
                </Points>
            )}
        </group>
    );
}

export default function ThreeBackground({ zoom = false }: ThreeBackgroundProps) {
    return (
        <div className="fixed inset-0 -z-10 bg-black">
            <Canvas camera={{ position: [0, 0, 3], fov: 75 }} dpr={[1, 2]} performance={{ min: 0.5 }}>
                <color attach="background" args={['#000000']} />
                <ParticleFlow zoom={zoom} />
            </Canvas>
        </div>
    );
}
