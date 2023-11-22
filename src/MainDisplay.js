import Sidebar from './ChatComponents/Sidebar';
import Chat from "./ChatComponents/Chat";
import "./Styles/MainDisplay.css"
import {MainDisplayProvider} from './Contexts/MainDisplayProvider';

const MainDisplay = ({user}) => {
  return (
    <MainDisplayProvider>
      <div className="whole">
        <div className="sidebar">
          <Sidebar />
        </div>

        <Chat />
      </div>
    </MainDisplayProvider>

  );
};
export default MainDisplay;

/**
 * 
 */