import React from 'react';
import {useNavigate} from 'react-router-dom';
import classess from './result.module.css'
import Canvas from './Canvas';
function PracticeResult({name,back}) {
    const navigate = useNavigate();
    const closeHandler = ()=>{
      navigate(`/${back}`)
    }
  return (
    <div className={classess.wrapper}>
    <div className={classess.canvas_block}>
        <Canvas width='100%' height='100%'/>
    </div>
    <div className={classess.result_block}>
        <div className={classess.center_block}>
        <h1 className={classess.h1}>congratulations</h1>
        <h1 className={classess.h1}>{name} won</h1>
        <button className={ classess.btn_close} onClick={closeHandler}>close</button>
    </div>
       
    </div>
</div>
  )
}

export default PracticeResult
