import React, { useEffect, useRef } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import * as THREE from 'three'

export default function ProjectTV(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/models/ProjectTV/computer.glb')
  const txt = useTexture(props.image)
  
  // Optimize texture with proper settings and compression
  useEffect(() => {
    if (txt) {
      txt.flipY = false;
      txt.minFilter = THREE.LinearFilter;
      txt.magFilter = THREE.LinearFilter;
      txt.generateMipmaps = true;
      txt.anisotropy = 4; // Lower anisotropy for better performance
      txt.encoding = THREE.sRGBEncoding;
      txt.needsUpdate = true;
    }
    
    // Cleanup function to dispose texture
    return () => {
      if (txt) {
        txt.dispose();
      }
    }
  }, [txt])
  
  useGSAP(() => {
    if (group.current) {
      gsap.from(group.current.rotation, {
        y: Math.PI * 2.5,
        duration: 1,
        ease: 'power2.easeOut'
      })
    }
  }, [txt])


  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="monitor-screen"
          castShadow
          receiveShadow
          geometry={nodes['monitor-screen'].geometry}
          material={nodes['monitor-screen'].material}
          position={[0.127, 1.831, 0.511]}
          rotation={[1.571, 0, 0]}
          scale={[0.661, 0.608, 0.401]}
        >
          <meshBasicMaterial map={txt} />
        </mesh>
        <group
          name="RootNode"
          position={[0, 1.093, 0]}
          rotation={[-Math.PI / 2, 0, -0.033]}
          scale={0.045}>
          {/* Removed 148 empty duplicate Screen groups to save ~10MB RAM */}
          <group
            name="Tower-light-007"
            position={[16.089, -3.47, -14.495]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.963}
          />
          <group
            name="Tower-light-008"
            position={[15.155, -3.47, -14.495]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.963}
          />
        </group>
        <group
          name="Monitor-B-_computer_0"
          position={[0.266, 1.132, 0.051]}
          rotation={[0, -0.033, 0]}
          scale={[0.042, 0.045, 0.045]}>
          <mesh
            name="Monitor-B-_computer_0_1"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_1'].geometry}
            material={materials.computer}
          />
          <mesh
            name="Monitor-B-_computer_0_2"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_2'].geometry}
            material={materials.base__0}
          />
          <mesh
            name="Monitor-B-_computer_0_3"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_3'].geometry}
            material={materials.Material_36}
          />
          <mesh
            name="Monitor-B-_computer_0_4"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_4'].geometry}
            material={materials.Material_35}
          />
          <mesh
            name="Monitor-B-_computer_0_5"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_5'].geometry}
            material={materials.Material_34}
          />
          <mesh
            name="Monitor-B-_computer_0_6"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_6'].geometry}
            material={materials.keys}
          />
          <mesh
            name="Monitor-B-_computer_0_7"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_7'].geometry}
            material={materials.keys2}
          />
          <mesh
            name="Monitor-B-_computer_0_8"
            castShadow
            receiveShadow
            geometry={nodes['Monitor-B-_computer_0_8'].geometry}
            material={materials.Material_37}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/ProjectTV/computer.glb')
