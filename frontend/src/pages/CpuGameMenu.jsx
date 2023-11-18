import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import {addBlockNums} from '../redux/cpuGameReducer'
import {useDispatch} from 'react-redux'
import classess from '../css/praticeMenu.module.css'
function CpuGameMenu() {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const winSize  = window.innerWidth -20;
    const [winType,setWinType] = useState()

    useEffect(()=>{
       
        if(window.innerWidth >= window.innerHeight){
 
          setWinType('desktop')
        }else{
      
          setWinType('mobile')
        }
    },[])
    const toHeighHandler = ()=>{
        // dispatch(addBlockNums({row:10,col:5,size:winSize/6,circleSize:10 }))
        if(winType === 'mobile'){

            dispatch(addBlockNums({row:7,col:5,size:winSize/6,circleSize:10 }))
        }else{
            dispatch(addBlockNums({row:5,col:10,size:winSize/15,circleSize:10 }))
        }
        navigate('/cpuGame')
    }
    const toLowHandler = ()=>{
        // dispatch(addBlockNums({row:4,col:2,size:winSize/5,circleSize:15 }))
        if(winType === 'mobile'){
            dispatch(addBlockNums({row:5,col:2,size:winSize/5,circleSize:15 }))
        }else{
            dispatch(addBlockNums({row:2,col:4,size:winSize/9,circleSize:15 }))
        }
       
        navigate('/cpuGame')
    }
    const backHandler = ()=>{
        navigate('/')
    }
  return (
    <div className={classess.wrapper}>
        <div className={classess.card}>
            <p>Number of dots</p>
            <div className={classess.btn_block}>
                <button className={classess.btn} onClick={toHeighHandler} >heigh</button>
                <button className={classess.btn} onClick={toLowHandler}>low</button>
            </div>
            <div className={classess.back_block}>
                    <button className={classess.back_btn} onClick={backHandler}>
                        <div className={classess.arrow_block}>
                            <div className={classess.arrow1}></div>
                            <div className={classess.arrow2}></div>
                            <div className={classess.arrow3}></div>
                            <div className={classess.arrow4}></div>
                        </div>
                    </button>
               </div>
        </div>
    </div>
  )
}

export default CpuGameMenu
