import React from "react";
import { ChatProvider } from "./store/ChatContext";
import TopNav from "./components/layout/TopNav";
import Sidebar from "./components/layout/Sidebar";
import ChatPane from "./components/layout/ChatPane";
import Toast from "./components/notifications/Toast";
import "./App.css";
const App: React.FC = () => {
  return (
    <ChatProvider>
      <div className="app">
       <div className="chats">
        <TopNav />
        <Sidebar />
       </div>
       <div className="chatpane">
         <ChatPane />
        <Toast />
       </div>
      </div>
     </ChatProvider>
  );
};

export default App;
