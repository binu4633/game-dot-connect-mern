import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector,useDispatch} from 'react-redux';
import {restartGame} from '../redux/onlineGameReducer'
import classess from './result.module.css'
import Canvas from './Canvas';
import { socket } from '../socket';

function Result() {
     const navigate = useNavigate();
     const dispatch = useDispatch()
     const users = useSelector((state) => state.onlineGameStore.users);
     const room = useSelector(state=>state.user.myRoom)
     const [name,setname] = useState('')

  useEffect(()=>{
    if(users){
      const newArr = users.map((u)=>{
        return {name:u.user , point: u.point.length}
      })
      newArr.sort((a,b)=>b.point - a.point);
      const maxim = newArr[0].point;
      const maximArr = newArr.filter(ar=>ar.point === maxim);
      const maximName = maximArr.map(m=>m.name);
      const names = maximName.join(' & ');
      setname(names)
    }
     
    
  },[])
  const closeHandler = ()=>{
   
    // navigate(`/myRoom/${room._id}`)
    socket.emit('finishGame')
    if(room ){
     
      navigate(`/myRoom/${room._id}`)
      dispatch(restartGame())
    }else{
      navigate('/onlineRoomsGroups')
    }
     
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

export default Result
