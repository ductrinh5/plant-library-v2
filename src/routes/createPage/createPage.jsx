import { useRef, useState } from "react";
import "./createPage.css";
import { useNavigate } from "react-router";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

const ModelPreview = ({ fileUrl }) => {
  const gltf = useLoader(GLTFLoader, fileUrl);
  return <primitive object={gltf.scene} position={[0, -0.5, 0]} />;
};

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

const CreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    family: "",
    description: "",
    application: "0",
    distribution: "",
    growth: "",
    history: "",
    value: "",
  });

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".glb")) {
      setFile(file);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!file) return alert("Please upload a .glb file");
      const filename = file.name;
      const modelPath = `/models/${filename}`;

      // Upload model file
      const data = new FormData();
      data.append("file", file);
      data.append("filename", filename);

      const uploadRes = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: data,
      });

      if (!uploadRes.ok) throw new Error("File upload failed");

      // Save plant data
      const saveRes = await fetch("http://localhost:3000/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, model: modelPath }),
      });

      if (!saveRes.ok) throw new Error("Failed to save plant data");

      setToast({ message: "✅ Publish thành công!", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ Publish thất bại!", type: "error" });
    }

    // Auto-dismiss toast
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  return (
    <div className="createPage">
      <div className="createTop">
        <h1>Create New Plant Post</h1>
        <button onClick={handleSubmit}>Publish</button>
      </div>

      <div className="createBottom">
        <div
          className={`upload ${fileUrl ? "previewMode" : ""}`}
          onClick={() =>
            !fileUrl && document.getElementById("fileInput").click()
          }
        >
          {!fileUrl && (
            <>
              <img src="/general/upload.svg" alt="" />
              <input
                id="fileInput"
                type="file"
                accept=".glb"
                hidden
                onChange={handleFileChange}
              />
              <div className="uploadInfo">
                We recommend using 3D files less than 3MB
              </div>
            </>
          )}
          {fileUrl && (
            <div className="modelPreview">
              <Canvas camera={{ position: [0, 1, 3], fov: 45 }}>
                <PerspectiveCamera
                  makeDefault
                  position={[0, 2, 4.6]}
                  fov={60}
                />
                <OrbitControls />
                <ambientLight intensity={2} />
                <Light />
                <Environment preset="dawn" />
                <ModelPreview fileUrl={fileUrl} />
              </Canvas>
            </div>
          )}
        </div>

        <form className="createForm">
          {[
            ["Name", "name"],
            ["Family", "family"],
            ["Description", "description", "textarea"],
            ["Distribution", "distribution", "textarea"],
            ["Growth", "growth", "textarea"],
            ["History", "history", "textarea"],
            ["Value", "value", "textarea"],
          ].map(([label, key, type]) => (
            <div className="createFormItem" key={key}>
              <label>{label}</label>
              {type === "textarea" ? (
                <textarea rows={4} name={key} onChange={handleInput} />
              ) : (
                <input type="text" name={key} onChange={handleInput} />
              )}
            </div>
          ))}

          <div className="createFormItem">
            <label>Application</label>
            <select name="application" onChange={handleInput}>
              <option value="0"></option>
              <option value="1">Thực phẩm</option>
              <option value="2">Đồ uống</option>
            </select>
          </div>
        </form>
      </div>

      {toast.message && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default CreatePage;
