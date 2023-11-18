import React from 'react';
import {useNavigate} from 'react-router-dom'
import classess from '../css/home.module.css';
import Loader from '../components/Loader';
function Home() {
   const navigate = useNavigate()
   const toPracticeMenuHandler = ()=>{
      navigate('/praticeMenu')
   }
   const toCpuGameMenuHandler = ()=>{
      navigate('/cpuGameMenu')
   }
   const toRoomsHandler = ()=>{
      navigate('/onlineRoomsGroups')
   }
  return (
    <div className={classess.wrapper}>
         {/* <Loader /> */}
         {/* <div className={classess.glass}> */}
         <div >

        
        <div className={classess.link_box}>
           <button onClick={toPracticeMenuHandler}>practice </button>
        </div>
        <div className={classess.link_box}>
           <button onClick={toCpuGameMenuHandler}>vs cpu </button>
        </div>
        <div className={classess.link_box}>
           <button onClick={toRoomsHandler}>online</button>
        </div>

        </div>
      
    </div>
  )
}

export default Home
