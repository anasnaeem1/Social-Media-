import Sidebar from "./sidebar";
import { SidebarContextProvider } from "../context/sidebarContext";

function SidebarWrapper(props) {
  return (
    <SidebarContextProvider>
      <Sidebar {...props} />
    </SidebarContextProvider>
  );
}

export default SidebarWrapper;

