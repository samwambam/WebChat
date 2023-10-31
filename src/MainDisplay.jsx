import Sidebar from './Sidebar';
import Chat from "./ChatComponents/Chat";
import "./Styles/MainDisplay.css"

const MainDisplay = ({user}) => {
  return (
    <div className="whole">
      <div className="sidebar">
        <Sidebar />
      </div>

      <Chat />
    </div>
  );
};
export default MainDisplay;

/**
 * 
 */