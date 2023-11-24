import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import classess from "../css/myRoom.module.css";
import { socket } from "../socket";
import { getTheRoom } from "../redux/userSlice";
import {addSnaps,addPlayers} from '../redux/onlineGameReducer';
import VoiceRoom from "../components/VoiceRoom";
import Loader from "../components/Loader";
function MyRoom() {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const room = useSelector((state) => state.user.myRoom);
  const user = useSelector((state) => state.user.userInfo);
  const snapShot = useSelector(state=>state.onlineGameStore.roomSnap);
  const status1 = useSelector(state=>state.user.status)
  const status2 = useSelector(state=>state.onlineGameStore.status);
  const isPlaying = useSelector(state=> state.onlineGameStore.isPlaying)
  const [membersSnap, setMemberSnap] = useState([]);
  const [players,setPlayers] = useState(null);
  const [playesName,setPlayersName] = useState('')
  const [gameLoading,setGameLoading] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate("/onlineRoomsGroups");
    }
    dispatch(getTheRoom(id));
    //  if(!room){
    //     navigate('/onlineRoomsGroups')
    //  }
    //  socket.emit('joinRoom',{

    //  })
  }, []);

  useEffect(() => {
    if (room && user) {
      socket.emit("joinRoom", { roomName: id, name: user.name });
    }
  }, [room]);
 
  const onBackButtonEvent = (e)=>{
    e.preventDefault();
   
    socket.emit('leaveRoom',)
    navigate("/onlineRoomsGroups");
  }

  useEffect(()=>{
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', onBackButtonEvent);
    return () => {
      window.removeEventListener('popstate', onBackButtonEvent);  
    };
  },[])

  useEffect(()=>{
    const connectRoom = (snap) => {
     
      if (snap && snap.members.length > 0) {
    
        dispatch(addSnaps(snap))
        const members = snap.members.map((m) => m.name);
        setMemberSnap(members);
      }
    }
    const letsStart = (snap)=>{
      dispatch(addSnaps(snap));
      dispatch(addPlayers(snap));
      setGameLoading(false)
      navigate("/onlineGame");
    }
    const playing = (p)=>{
      console.log('playing p ', p)
      setPlayers(p)
    }
    const areUplaying = (data,callback) =>{
      console.log('isplaying', isPlaying)
      console.log('this are u playing area workssss')
      // callback({isPlaying})
      
      // callback({isPlaying:isPl})
      callback({isPlaying})
    }
    socket.on("connectedRoom",connectRoom );
    socket.on('letsStart',letsStart)
    socket.on('playing',playing)
    socket.on('areUplaying',areUplaying);

    return ()=>{
      socket.off("connectedRoom",connectRoom );
      socket.off('letsStart',letsStart)
      socket.off('playing',playing)
      socket.off('areUplaying',areUplaying);
    }

  },[])

  
  


  useEffect(()=>{
    if(players && players.length >0){
      console.log('playessss', players)
      // const namesArray = players.map(p=>p.name);
      const names = players.join(' & ');
      console.log('nameesss', names)
      setPlayersName(names)
    }
  },[players])

  // console.log('players', players)
   const gameOnHandler = ()=>{
    setPlayers(null);
    setGameLoading(true)
    socket.emit('gameStart',{roomName:id,snapShot})
    // navigate("/onlineGame");
   }
 const backHandler = ()=>{
  navigate('/onlineRoomsGroups')
 }
  const memberStyle1 = {
    opacity:'0.2'
  }
  const memberStyle2 = {
    opacity:'1'
  }
  return (
    <div className={classess.wrapper}>
      {status1 == 'loading' && <Loader />}
      {status2 == 'loading' && <Loader />}
      {room && (
        <div className={classess.card}>
          <h5>{room.name}</h5>
          <div className={classess.member_block}>
            {room.members.length > 0 &&
              room.members.map((m,i) => {
                return <p key={i} style={membersSnap.includes(m.name)?memberStyle2: memberStyle1}>{m.name}</p>;
              })}
          </div>
        </div>
      )}
      {players && players.length >0 &&
      <p className={classess.warning}>{playesName} playing the game, you can join the game after finish the game</p>
      }
       {
        membersSnap.length >1 &&
        <button className={ classess.btn_go} onClick={gameOnHandler}>Lets go...</button>
       }
        {gameLoading && <Loader />}
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
       <VoiceRoom />
    </div>
  );
}

export default MyRoom;
