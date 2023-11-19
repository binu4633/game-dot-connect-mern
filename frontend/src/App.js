import { Route,Routes } from "react-router-dom";
import SharedLayout from "./pages/SharedLayout";
import Home from "./pages/Home";
import PraticeMenu from "./pages/PraticeMenu";
import PracticeGame from "./pages/PracticeGame";
import Win from "./pages/Win";
import CpuGameMenu from "./pages/CpuGameMenu";
import CpuGame from "./pages/CpuGame";
import OnlineRoomsGroups from "./pages/OnlineRoomsGroups";
import MyRoom from "./pages/MyRoom";
import Invitations from "./pages/Invitations";
import OnlineGame from "./pages/OnlineGame";
// import Loader from "./components/Loader";
// import Canvas from "./components/Canvas";
// import Modal from "./components/Modal";
function App() {
  return (
    <>
    {/* <Canvas /> */}
    {/* <Modal /> */}
    {/* <Loader /> */}
    <Routes>
      <Route path="/" element={<SharedLayout/>}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/praticeMenu" element={<PraticeMenu />} />
      <Route path="/praticeGame" element={<PracticeGame />} />
      <Route path="/cpuGameMenu" element={<CpuGameMenu />} />
      <Route path="/cpuGame" element={<CpuGame />} />
      <Route path="/onlineRoomsGroups" element={<OnlineRoomsGroups />} />
      <Route path="/myRoom/:id" element={<MyRoom/>} />
      <Route path="/invitations" element={<Invitations/>} />
      <Route path="/onlineGame" element={<OnlineGame/>} />


       <Route path="/win" element={<Win />} />
    </Routes>
    
    </>
  );
}

export default App;



// 725596814658-qkhc0vfg1gp5lhugp5croe87rkfct2ik.apps.googleusercontent.com

// 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    client secret