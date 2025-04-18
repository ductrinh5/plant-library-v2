import GalleryItem from "../galleryItem/galleryItem";
import "./gallery.css";
import { useEffect, useState } from "react";

const Gallery = ({ search }) => {
  const [plants, setPlants] = useState([]);

  const handleDelete = (deletedId) => {
    setPlants((prev) => prev.filter((plant) => plant.id !== deletedId));
  };

  useEffect(() => {
    fetch("http://localhost:3000/api")
      .then((res) => res.json())
      .then((data) => {
        setPlants(data.plants);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
      });
  }, []);

  return (
    <div className="gallery">
      {plants.map((plant) => (
        <GalleryItem key={plant.id} item={plant} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default Gallery;
