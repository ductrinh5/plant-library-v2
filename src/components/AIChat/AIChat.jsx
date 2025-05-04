import "./AIChat.css";
import { useState } from "react";

const AIChat = ({ plant }) => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="AIChats">
      <div className="InteractionsButton">
        <button
          onClick={() => setActiveTab("chat")}
          className={activeTab === "chat" ? "active" : ""}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("metadata")}
          className={activeTab === "metadata" ? "active" : ""}
        >
          Metadata
        </button>
      </div>

      <div className="tabs">
        <div
          className={`AIChatContent ${activeTab === "chat" ? "" : "hidden"}`}
          data-state={activeTab === "chat" ? "active" : "inactive"}
        >
          <p>Chat AI sẽ được tạo ra ở đây</p>
          <form className="AIChatForm">
            <input type="text" placeholder="Ask anything" />
            <button className="send">
              <div>Send</div>
            </button>
          </form>
        </div>
        <div
          className={`Metadata ${activeTab === "metadata" ? "" : "hidden"}`}
          data-state={activeTab === "metadata" ? "active" : "inactive"}
        >
          <div className="aiChatContainer">
            <h2>Thông tin về {plant.name}</h2>
            <p>
              <strong>Họ:</strong> <br /> {plant.family}
            </p>
            <p>
              <strong>Ứng dụng:</strong> <br /> {plant.application}
            </p>
            <p>
              <strong>Mô tả:</strong> <br /> {plant.description}
            </p>
            <p>
              <strong>Giá trị:</strong> <br /> {plant.value}
            </p>
            <p>
              <strong>Lịch sử:</strong> <br /> {plant.history}
            </p>
            <p>
              <strong>Tăng trưởng:</strong> <br /> {plant.growth}
            </p>
            <p>
              <strong>Phân bố:</strong> <br /> {plant.distribution}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
