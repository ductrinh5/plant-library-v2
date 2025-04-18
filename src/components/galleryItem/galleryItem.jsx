import "./galleryItem.css";
import { Link } from "react-router";
import { Canvas, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment } from "@react-three/drei";
import { Suspense } from "react";
import { useInView } from "react-intersection-observer";
import { useRef, useState } from "react";
import { Outlet } from "react-router";

function Model({ modelPath }) {
  if (!modelPath) return null; // Tránh lỗi khi chưa có dữ liệu

  const result = useLoader(GLTFLoader, modelPath);

  return <primitive object={result.scene} position={[0, -0.5, 0]} />;
}

const GalleryItem = ({ item, onDelete }) => {
  // const { ref, inView } = useInView({ triggerOnce: true });
  const isLoggedIn = !!localStorage.getItem("token");

  const canvasRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // const handleSaveThumbnail = async () => {
  //   const canvas = canvasRef.current?.querySelector("canvas");
  //   if (!canvas) {
  //     console.log("No canvas found");
  //     return;
  //   }

  //   const dataURL = canvas.toDataURL("image/png");

  //   const res = await fetch("http://localhost:3000/api/save-thumbnail", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       dataUrl: dataURL,
  //       filename: `${item.id}.png`,
  //     }),
  //   });

  //   if (res.ok) {
  //     alert("Thumbnail saved!");
  //   } else {
  //     alert("Failed to save thumbnail.");
  //   }
  // };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`))
      return;

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:3000/api?id=${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      const data = await res.json();
      alert(data.message);
      onDelete(item.id); // Notify parent to update state
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete item");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="galleryItem" ref={canvasRef}>
      <img src={item.preview} alt="Model preview" className="modelThumbnail" />
      <Link to={`/post/${item.id}`} className="overlay"></Link>
      <div className="overlayIcons">
        {isLoggedIn && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={isDeleting ? "deleting" : ""}
          >
            {isDeleting ? (
              "..."
            ) : (
              <img src="/general/delete.svg" alt="Delete" />
            )}
          </button>
        )}
        <Outlet />
        {/* <button onClick={}>📸</button> */}
      </div>
    </div>
  );
};

export default GalleryItem;
