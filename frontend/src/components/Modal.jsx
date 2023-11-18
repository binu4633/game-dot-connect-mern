import React,{useEffect,useState} from 'react';
import ReactDOM from 'react-dom';
import {useSelector,useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {continueGame,deleteDisconnectMembers,disconnectClose} from '../redux/onlineGameReducer'
import classes from './modal.module.css';
import {socket} from '../socket'
const BackDrops= ()=>{
  const dispatch = useDispatch()
  const disconnectMembers = useSelector(state=>state.onlineGameStore.disconnectMembers);
  const members = useSelector(state=>state.onlineGameStore.members);
  const room = useSelector(state=>state.user.myRoom);
  const navigate = useNavigate();

  const [disconnectName, setDisconnectName] = useState('');
  const [ramains,setRemains] = useState()
  
  useEffect(()=>{
    
   

    if(disconnectMembers && disconnectMembers.length >0 && members && members.length >0){
     
      const names = disconnectMembers.join(' & ');
       
       setDisconnectName(names);
       const countRemains = members.length - disconnectMembers.length;
      
       setRemains(countRemains)
    }
  },[disconnectMembers,members]);

  useEffect(()=>{
    socket.on('resumeGame',()=>{
     dispatch(continueGame());
     dispatch(deleteDisconnectMembers());
     dispatch(disconnectClose())
    })
  })

  const closeWithHandler = ()=>{
    socket.emit('leaveRoom');
    dispatch(deleteDisconnectMembers())
    navigate('/onlineRoomsGroups')
  }
  const closeHandler = ()=>{
    socket.emit('leaveRoom');
    dispatch(deleteDisconnectMembers())
    if(room ){
     navigate(`/myRoom/${room._id}`)
      // dispatch(restartGame())
    }else{
      navigate('/onlineRoomsGroups')
    }
  }
  const continueHandler = ()=>{
       socket.emit('resume', room._id)
    //  dispatch(continueGame());
    //  dispatch(deleteDisconnectMembers());
    //  dispatch(disconnectClose())
  }
 console.log('remains',ramains)
  return(<div  className={classes.backdrop}  >
           {ramains&& ramains >= 2 ?
                <div className={classes.modal}>
                <p>{disconnectName} closed the game do you want to continue without them or restart</p>
                <button className={classes.btn} onClick={continueHandler}>continue</button>
                <button className={classes.btn} onClick={closeWithHandler}>close</button>
               </div>
               :
               <div className={classes.modal}>
               <p>{disconnectName} closed the game </p>
             
               <button className={classes.btn} onClick={closeHandler}>close</button>
              </div>
           }
        
        </div>)
}


const portalElement = document.getElementById('overlays');

function Modal() {
  return (
    <>
      {ReactDOM.createPortal(<BackDrops  />,portalElement )}
      
    </>
  )
}

export default Modal
