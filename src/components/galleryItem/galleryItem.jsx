import "./galleryItem.css";
import { Link } from "react-router";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, PerspectiveCamera } from "@react-three/drei";

function Model({ modelPath }) {
  if (!modelPath) return null; // Tránh lỗi khi chưa có dữ liệu

  const result = useLoader(GLTFLoader, modelPath);

  return <primitive object={result.scene} position={[0, -0.5, 0]} />;
}

const GalleryItem = ({ item }) => {
  return (
    <div
      className="galleryItem"
      // style={{ gridRowEnd: `span ${Math.ceil(item.height / 100)}` }}
    >
      <Canvas camera={{ position: [0, 2, 4.6], fov: 60 }}>
        <ambientLight intensity={2} />
        <Environment preset="dawn" />
        <Model modelPath={item.model} />
      </Canvas>
      <Link to={`/post/${item.id}`} className="overlay"></Link>
      <div className="overlayIcons">
        <button>
          <img src="/general/share.svg" alt="" />
        </button>
        <button>
          <img src="/general/more.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default GalleryItem;
