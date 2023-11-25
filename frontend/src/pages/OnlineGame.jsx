import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import {
  addBlockNums,
  createBlocks,
  createCircle,
  updateBlocks,
  updateCircle,
  disconnectOpen,
  addDisconnectMembers,
  isPlayingOn,
  isPlayingOff
} from "../redux/onlineGameReducer";
import {
  possibleConnection,
  isPossibleConnetion,
  affectedSqConnection,
  affectedCircles,
} from "../logic/fnLogic.js";

import classes from "../css/onlineGame.module.css";
import Result from "../components/Result";
import { socket } from "../socket";
import VoiceRoom from "../components/VoiceRoom.jsx";
import Modal from "../components/Modal.jsx";

function OnlineGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const winSize  = window.innerWidth -20;
  const arrayBlocks = useSelector((state) => state.onlineGameStore.blockArray);
  const arrayCircle = useSelector((state) => state.onlineGameStore.circleArray);
  const maxSqCol = useSelector((state) => state.onlineGameStore.colNums);
  const maxSqRow = useSelector((state) => state.onlineGameStore.rowNums);
  const boxSize = useSelector((state) => state.onlineGameStore.blockSize);
  const circleSize = useSelector((state) => state.onlineGameStore.circleSize);
  const user1 = useSelector((state) => state.onlineGameStore.user1);
  const user2 = useSelector((state) => state.onlineGameStore.user2);
  const totalBlock = useSelector((state) => state.onlineGameStore.totalBlocks);
  const filledBlockArray = useSelector((state) => state.onlineGameStore.filledBlockArray);
  const snaps = useSelector((state) => state.onlineGameStore.roomSnap);
  const users = useSelector((state) => state.onlineGameStore.users);
  const members = useSelector((state) => state.onlineGameStore.members);
  const activeIndex = useSelector((state) => state.onlineGameStore.activeIndex);
  const moveNumber = useSelector((state) => state.onlineGameStore.moveNumber);
  const user = useSelector((state) => state.user.userInfo);
  const disconnectWindow =useSelector((state) => state.onlineGameStore.disconnectWindow);
  const isPlaying = useSelector(state=> state.onlineGameStore.isPlaying)
 
  const [prevMove, setPreMove] = useState([]);
  const [dots, setDots] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [firstDot, setFirstDot] = useState(null);
  // const [disconnectedMembers,setDisconnectedMembers] = useState(null)
  useEffect(() => {
    if (!snaps || !users ) {
      navigate("/onlineRoomsGroups");
      socket.emit('leaveRoom');
      dispatch(isPlayingOff())
    }
    dispatch(addBlockNums({row:7,col:5,size:winSize/6,circleSize:15 }))
   
  }, []);

  useEffect(()=>{
    dispatch(createBlocks());
    dispatch(createCircle());
    dispatch(isPlayingOn())
  },[maxSqCol,maxSqRow,boxSize,circleSize])


  useEffect(()=>{
    const areUplaying = (data, callback) =>{
      console.log('isplaying', isPlaying)
      console.log('this are u playing area workssss')
      // callback({isPlaying})
      callback({
        name:user.name,
        isPlaying})
    }
    socket.on('areUplaying',areUplaying);
    return ()=>{
      socket.off('areUplaying',areUplaying);
    }
  },[isPlaying])

  // useEffect(() => {
  //   if (user2.active) {
  //     const move = nextMove(arrayBlocks);

 
  //     if (move.length > 0) {
  //       const circles = affectedCircles(move, arrayCircle);
  //       let timeSet = setTimeout(() => {
  //         dispatch(updateBlocks(move));
  //         dispatch(updateCircle(circles));
  //         setPreMove(move.map((ar) => `${ar[0]}${ar[1]}${ar[2]}`));
  //       }, 1000);
  //       return () => {
  //         clearTimeout(timeSet);
  //       };
  //     }
  //   }
  // }, [user2.active, user2.point]);


  // useEffect(()=>{
  //   if(unBlocked==0 ){
  //     navigate('/win')
  //   }
  // },[unBlocked])
   useEffect(()=>{
    socket.once("gameDots", (dots) => {

      const affectedSq = affectedSqConnection(
        dots.firstCircle,
        dots.secondCircle,
        dots.maxRow,
        dots.maxCol
      );
      dispatch(updateBlocks({affectedSq,activeIndexNum:dots.activeIndex,moveNumber:dots.moveNumber}));
      dispatch(updateCircle({ first:  dots.firstCircle, second: dots.secondCircle}));
      setPreMove(affectedSq.map((ar) => `${ar[0]}${ar[1]}${ar[2]}`));
      setDots([]);
      setFirstClick(true);
    });
    console.log('membersss before', members)
    socket.on("disConnectedRoom", (snap) => {
     
      if (snap && snap.members.length > 0) {
         console.log('membersss', members);
         console.log('snap', snap)
        const newMembers = snap.members.map((m) => m.name);
       
        let disconnectedMember;
        if(members){
          // const disconnectedMember = members.filter(m=>{
           disconnectedMember = members.filter(m=>{
            if(!newMembers.includes(m)){
              return m
              } 
          });
        }
     
        if(disconnectedMember && disconnectedMember.length >0){
          // setDisconnectedMembers(disconnectedMember);
          dispatch(addDisconnectMembers(disconnectedMember))
           dispatch(disconnectOpen())
        }
        // dispatch(addSnaps(snap))
        // setMemberSnap(members);
      }
    });
   })

  

  const circleClickHandler = (t) => {
    console.log('active index', activeIndex)
    if (user.name !== users[activeIndex].user) {
      return;
    }

    if (firstClick) {
      const possibles = possibleConnection({
        ...t,
        rowMax: maxSqRow + 1,
        colMax: maxSqCol + 1,
      });
      setFirstDot(t);
      setDots(possibles);
      setFirstClick(false);
    
    } else {
      const isValid = isPossibleConnetion(t, dots);
      if (!isValid) {
        const possibles = possibleConnection({
          ...t,
          rowMax: maxSqRow + 1,
          colMax: maxSqCol + 1,
        });
        setFirstDot(t);
        setDots(possibles);
        setFirstClick(false);
        return;
      }
   
      if (snaps && snaps.room) {
        const roomName = snaps.room;
        const circleJoints = {
          firstCircle: firstDot,
          secondCircle: t,
          maxRow: maxSqRow,
          maxCol: maxSqCol,
          moveNumber,
          activeIndex,
        };
        socket.emit("gameOn", { roomName, circleJoints });
      } else {
        return;
      }

      // gameCtx.updateBlocks(affectedSq);
     
    }
    //   setDots(['01','02','04'])
  };

  const userActiveStyle = {
        backgroundColor:'rgba(151, 188, 98,0.6)',
        outline:'2px solid white',
        color:'white',
        borderRadius:'50px',
        boxShadow:  '4px 7px 22px -1px rgba(0,0,0,0.75)' 
  };

  const colorIndexes = {
    1:'red',
    2:'green',
    3:'blue',
    4:'yellow'
  }

  return (
    <div>
      {disconnectWindow && <Modal/>}
      <div className={classes.wrapper}>
      <div className={classes.align__box}>
        {/* <Result /> */}
        <div className={classes.users}>
          {users &&
            users.length > 0 &&
            users.map((u, i) => {
              return (
                <div className={classes.user} key={i}>
                  <h4 style={u.index == activeIndex ? userActiveStyle : null}>
                    {/* <h4 style={ userActiveStyle }> */}
                    {/* you <span className={classes.span}>{user1.point}</span> */}
                    {u.user} <span className={classes.span}>{u.point.length}</span>
                  </h4>
                </div>
              );
            })}
        </div>
        {/* <button className={classes.next_move} onClick={nextMoveTestHandler}>next move</button> */}
        <div>
          {/* {unBlocked==0 && <h1 className={classes.h1}>the game is over</h1>} */}
        </div>

        {/* {unBlocked === 0 && <Result name={user1.active ? "you" : "cpu"} />} */}

        {totalBlock !== 0 && totalBlock === filledBlockArray.length && 
        <Result />} 

        {totalBlock !== filledBlockArray.length && (
          <div
            className={classes.gameArea}
            style={{
              width: `${(maxSqCol + 1) * boxSize}px`,
              height: `${(maxSqRow + 1) * boxSize}px`,
            }}
          >
            <div
              className={classes.boxArea}
              style={{
                gridTemplateColumns: `repeat(${maxSqCol + 1},1fr)`,
                gridTemplateRows: `repeat(${maxSqRow + 1},1fr)`,
              }}
            >
              {arrayBlocks.length > 0 &&
                arrayBlocks.flat().map((ar) => {
                  //  topArray.flat().map(ar=>{
                  return (
                    <div
                      key={uuid()}
                      style={{
                        width: `${boxSize}px`,
                        height: `${boxSize}px`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // outlineLeft: '1px solid black'
                        // border:'1px solid black',
                        // borderCollapse: 'separate'
                        // backgroundColor:'pink'
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor:
                            ar.completeSide == 4 ? "rgba(151, 188, 98,0.6)" : "none",
                          borderLeft: ar.left ? "1px solid black" : "none",
                          borderRight: ar.right ? "1px solid black" : "none",
                          borderTop: ar.top ? "1px solid black" : "none",
                          borderBottom: ar.bottom ? "1px solid black" : "none",
                        }}
                      >
                        {/* <h1 className={classes.h1}>{`${ar.row}${ar.col}`}</h1> */}
                        <h1
                       style={{color:ar.user === 'user1'?'red':'green'}}
                       >{ar.point===0 ?'':ar.point}</h1>
                        <div className={classes.top_container}> 
                          <div
                            className={classes.top_arrow}
                            style={{
                              borderLeft: `${boxSize / 10}px solid transparent`,
                              borderRight: `${
                                boxSize / 10
                              }px solid transparent`,
                              borderBottom: `${boxSize / 10}px solid red`,
                              // display: prevMove.includes(
                              //   `${ar.row}${ar.col}top`
                              // )
                              //   ? "block"
                              //   : "none",
                                opacity:prevMove.includes(`${ar.row}${ar.col}top`)?'1':"0"
                            }}
                          ></div>
                        </div>
                        <div className={classes.middle_container}>
                          <div className={classes.center_left}>
                            <div
                              className={classes.left_arrow}
                              style={{
                                borderTop: `${
                                  boxSize / 10
                                }px solid transparent`,
                                borderBottom: `${
                                  boxSize / 10
                                }px solid transparent`,
                                borderRight: `${boxSize / 10}px solid red`,
                                // display: prevMove.includes(
                                //   `${ar.row}${ar.col}left`
                                // )
                                //   ? "block"
                                //   : "none",
                                  opacity:prevMove.includes(`${ar.row}${ar.col}left`)?'1':"0"
                              }}
                            ></div>
                          </div>
                          <div className={classes.center_center}>
                            {/* <h1 style={{fontSize:`${boxSize/5}px `}}>{`${ar.row}${ar.col}`}</h1> */}
                            <h1
                              style={{
                                // color: `${colorIndexes[ar.userIndex]}`,
                                color: colorIndexes[ar.userIndex],
                                fontSize: `${boxSize / 5}px `,
                              }}
                            >
                            
                              {ar.point === 0 ? "" : ar.point}
                            </h1>
                          </div>
                          <div className={classes.center_right}>
                            <div
                              className={classes.right_arrow}
                              style={{
                                borderTop: `${
                                  boxSize / 10
                                }px solid transparent`,
                                borderBottom: `${
                                  boxSize / 10
                                }px solid transparent`,
                                borderLeft: `${boxSize / 10}px solid red`,
                                // display: prevMove.includes(
                                //   `${ar.row}${ar.col}right`
                                // )
                                //   ? "block"
                                //   : "none",
                                  opacity:prevMove.includes(`${ar.row}${ar.col}right`)?'1':"0"
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className={classes.bottom_container}>
                          <div
                            className={classes.bottom_arrow}
                            style={{
                              borderLeft: `${boxSize / 10}px solid transparent`,
                              borderRight: `${
                                boxSize / 10
                              }px solid transparent`,
                              borderTop: `${boxSize / 10}px solid red`,
                              // display: prevMove.includes(
                              //   `${ar.row}${ar.col}bottom`
                              // )
                              //   ? "block"
                              //   : "none",
                                opacity:prevMove.includes(`${ar.row}${ar.col}bottom`)?'1':"0"
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div
              className={classes.circleArea}
              style={{
                gridTemplateColumns: `repeat(${maxSqCol + 2},1fr)`,
                gridTemplateRows: `repeat(${maxSqRow + 2},1fr)`,
                gap: `${boxSize - circleSize}px`,
                top: `-${circleSize / 2}px`,
                left: `-${circleSize / 2}px`,
              }}
            >
              {arrayCircle &&
                arrayCircle.length > 0 &&
                arrayCircle.flat().map((ar) => {
                  return (
                    <div
                      onClick={ circleClickHandler.bind(this, {
                        row: ar.row,
                        col: ar.col,
                        left: ar.left,
                        right: ar.right,
                        top: ar.top,
                        bottom: ar.bottom,
                      })}
                      key={uuid()}
                      style={{
                        width: `${circleSize}px`,
                        height: `${circleSize}px`,
                        outline: "1px solid black",
                        borderRadius: "50%",
                        backgroundColor: dots.includes(`${ar.row}*${ar.col}`)
                          ? "red"
                          : "rgba(151, 188, 98,0.6)",
                        // backgroundColor:'blue'
                      }}
                    >
                      {/* row{ar.row} col{ar.col} */}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      <VoiceRoom />
      </div>
    </div>
  );
}

export default OnlineGame;
