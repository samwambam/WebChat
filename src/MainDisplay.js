import Sidebar from './ChatComponents/Sidebar';
import Chat from "./ChatComponents/Chat";
import "./Styles/MainDisplay.css"
import {MainDisplayProvider} from './Contexts/MainDisplayProvider';

const MainDisplay = () => {
  return (
    <MainDisplayProvider>
      <div className="whole">
        <div className="sidebar">
          <Sidebar />
        </div>

        <div className='chat-content'>
          <Chat />
        </div>

      </div>
    </MainDisplayProvider>
  );
};
export default MainDisplay;

/**
 * 
 */