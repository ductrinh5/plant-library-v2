import { Outlet } from "react-router";
import LeftBar from "../../components/leftBar/leftBar";
import TopBar from "../../components/topBar/topBar";
import "./mainLayout.css";

const MainLayout = () => {
  const isAuthenticated = localStorage.getItem("auth") === "true";

  return (
    <div className="app">
      {isAuthenticated && <LeftBar />}
      <div className="content">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
