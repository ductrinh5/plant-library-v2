import { Outlet } from "react-router";
import LeftBar from "../../components/leftBar/leftBar";
import TopBar from "../../components/topBar/topBar";
import "./mainLayout.css";

const MainLayout = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="app">
      {isLoggedIn && <LeftBar />}
      <div className="content">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
