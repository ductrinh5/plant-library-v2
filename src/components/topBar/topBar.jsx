import { useNavigate } from "react-router";
import AIButton from "../AIButton/AIButton";
import "./topBar.css";

const TopBar = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/search?search=${e.target[0].value}`);
  };

  return (
    <div className="topBar">
      <div className="search">
        <form onSubmit={handleSubmit}>
          <img src="/general/search.svg" alt="" />
          <input type="text" placeholder="Search" />
        </form>
      </div>
      <AIButton />
      <div className="filters">
        <select className="filter-dropdown">
          <optgroup value="fruit">Fruit</optgroup>
          <option value="vegetable">Vegetable</option>
          <option value="flower">Flower</option>
          <option value="tree">Tree</option>
        </select>
        <select className="filter-dropdown">
          <option value="">Region</option>
          <option value="tropical">Tropical</option>
          <option value="temperate">Temperate</option>
          <option value="desert">Desert</option>
          <option value="mountain">Mountain</option>
        </select>
      </div>
    </div>
  );
};

export default TopBar;
