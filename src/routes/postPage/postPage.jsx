import AIChat from "../../components/AIChat/AIChat";
import "./postPage.css";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router";

function Light() {
  const light = useRef();
  // useHelper(light, SpotLightHelper, "orange");
  return (
    <spotLight
      ref={light}
      intensity={80}
      color={0xffea00}
      position={[10, 15, 0]}
    />
  );
}

function Model({ modelPath }) {
  if (!modelPath) return null; // Tránh lỗi khi chưa có dữ liệu

  const result = useLoader(GLTFLoader, modelPath);

  return <primitive object={result.scene} position={[0, -0.5, 0]} />;
}

function AnimatedCamera() {
  const { camera } = useThree();
  const [done, setDone] = useState(false);
  const targetZ = 3.6;
  const speed = 0.05;

  useEffect(() => {
    let frameId;

    const animate = () => {
      if (!done) {
        camera.position.z = camera.position.z * (1 - speed) + targetZ * speed;

        if (Math.abs(camera.position.z - targetZ) < 0.01) {
          camera.position.z = targetZ;
          setDone(true);
          setAnimationDone(true);
          return; // Stop animation
        }

        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => cancelAnimationFrame(frameId);
  }, [camera, done]);

  return <PerspectiveCamera makeDefault position={[0, 2, 4.6]} fov={60} />;
}

const PostPage = () => {
  const { id } = useParams();

  const [plant, setPlant] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:3000/api?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.plants.length > 0) {
          setPlant(data.plants[0]); // Lấy cây trồng đầu tiên (chỉ có 1)
        }
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, [id]);

  if (!plant) return <div>Đang tải...</div>;

  return (
    <div className="postPage">
      <div className="postContainer">
        <div className="postImg">
          <Canvas>
            <AnimatedCamera />
            <Environment preset="dawn" />
            <OrbitControls />
            <ambientLight intensity={2} />
            <Light />
            <Model modelPath={plant.model} />
          </Canvas>
        </div>
        <div className="postDetails">
          <AIChat plant={plant} />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
