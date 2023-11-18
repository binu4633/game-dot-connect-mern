import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import classess from "../css/onlineRoomsGroups.module.css";
import Glogin from "../components/Glogin";
import { logout, createRooms, getRooms, addToMyRoom ,addFriendToRooms,leaveRoom} from "../redux/userSlice";
import Loader from "../components/Loader";
function OnlineRoomsGroups() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const rooms = useSelector((state) => state.user.rooms);
  const status = useSelector((state)=>state.user.status)
  const [isLogged, setIsLogged] = useState(false);
  const [roomInputText, setRoomInputText] = useState("");
  const [roomInviteId, setRoomInviteId] = useState();
  const [invite,setInvite] = useState(false)
  const inviteTextRef = useRef()
  
  const logoutHandler = () => {
    // localStorage.setItem('userInfo',null)
    dispatch(logout());
    setIsLogged(false);
  };
  useEffect(() => {
    //  const user = JSON.parse(localStorage.userInfo)
   
    if (user) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [user]);

  useEffect(() => {
    dispatch(getRooms());
  }, []);
   
  const roomInputChangeHandler = (e) => {
    setRoomInputText(e.target.value);
   
  };
const toInvitationHandler = ()=>{
  navigate('/invitations')
}
  const roomCreateHandler = (e) => {
    e.preventDefault();
    dispatch(createRooms(roomInputText));
    setRoomInputText("");
  };
  const roomInviteHandler = (id) => {
    if(invite){
      setInvite(false)
    }else{

      setInvite(true)
    }
    setRoomInviteId(id);
  };
  const inviteHandler = (e)=>{
    e.preventDefault()
   
    dispatch(addFriendToRooms({
      roomId : roomInviteId,
      emailId:inviteTextRef.current.value
    }))
    setInvite(false)
  }
  const roomLeaveHandler = (id) => {
     dispatch(leaveRoom(id))
  };
  const roomProceedHandler = (room) => {
    dispatch(addToMyRoom(room));
    navigate(`/myRoom/${room.id}`);
  };

  const backHandler = ()=>{
    navigate('/')
  }
  return (
    <div className={classess.wrapper}>
      {!isLogged && <h3 className={classess.h3}>Login with google to continue</h3> }
      {!isLogged && <Glogin /> }
      {status ==='loading' && <Loader />}

      {isLogged && (
        <div className={classess.wrapper}>
            <button  className={classess.btn_invite} onClick={toInvitationHandler}>find invitaions</button>
          <form onSubmit={roomCreateHandler} className={classess.create_room}>
           <p>create room</p>
            <input
              type="text"
              onChange={roomInputChangeHandler}
              value={roomInputText}
            />
            <button>submit</button>
          </form>

          <div>
            {rooms &&
              rooms.length > 0 &&
              rooms.map((r) => {
                return (
                  <div key={r.id} className={classess.room_div}>
                    <p>{r.name}</p>
                    <button
                      className={classess.btn_room}
                      onClick={roomInviteHandler.bind(this, r.id)}
                    >
                      invite
                    </button>
                    <button
                      className={classess.btn_room}
                      onClick={roomLeaveHandler.bind(this,r.id)}
                    >
                      leave
                    </button>
                    <button
                      className={classess.btn_room}
                      onClick={roomProceedHandler.bind(this, {
                        id: r.id,
                        name: r.name,
                      })}
                    >
                      &#8594;
                    </button>
                    {roomInviteId === r.id && invite &&
                      <div>
                      <form onSubmit={inviteHandler} className={classess.invite__form}>
                        <p>enter email id</p>
                        <input type="email" ref={inviteTextRef}/>
                        <button>submit</button>
                      </form>
                    </div>
                    }
                  
                  </div>
                );
              })}
          </div>
          <button className={classess.btn_loggedout} onClick={logoutHandler}>
            Log out
          </button>
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
      )}
    </div>
  );
}

export default OnlineRoomsGroups;
