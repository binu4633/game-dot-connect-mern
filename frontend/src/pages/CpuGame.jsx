import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";
import {
  createBlocks,
  createCircle,
  updateBlocks,
  updateCircle,
} from "../redux/cpuGameReducer";
import {
  possibleConnection,
  isPossibleConnetion,
  affectedSqConnection,
  affectedCircles,
} from "../logic/fnLogic.js";
import classes from "../css/practiceGame.module.css";
// import Result from "../components/Result";
import PracticeResult from "../components/PracticeResult.jsx";
import { nextMove } from "../logic/move";
function CpuGame() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const arrayBlocks = useSelector((state) => state.cpuGameStore.blockArray);
  const arrayCircle = useSelector((state) => state.cpuGameStore.circleArray);
  const maxSqCol = useSelector((state) => state.cpuGameStore.colNums);
  const maxSqRow = useSelector((state) => state.cpuGameStore.rowNums);
  const boxSize = useSelector((state) => state.cpuGameStore.blockSize);
  const circleSize = useSelector((state) => state.cpuGameStore.circleSize);
  const user1 = useSelector((state) => state.cpuGameStore.user1);
  const user2 = useSelector((state) => state.cpuGameStore.user2);
  const unBlocked = useSelector((state) => state.cpuGameStore.totalBlocks);

  const [prevMove, setPreMove] = useState([]);
  const [dots, setDots] = useState([]);
  const [firstClick, setFirstClick] = useState(true);
  const [firstDot, setFirstDot] = useState(null);
  useEffect(() => {
    if (maxSqRow === null) {
      navigate("/cpuGameMenu");
    }
    dispatch(createBlocks());
    dispatch(createCircle());
  }, []);

  useEffect(() => {
    if (user2.active) {
      const move = nextMove(arrayBlocks);

     
      if (move.length > 0) {
        const circles = affectedCircles(move, arrayCircle);
        let timeSet = setTimeout(() => {
          dispatch(updateBlocks(move));
          dispatch(updateCircle(circles));
          setPreMove(move.map((ar) => `${ar[0]}${ar[1]}${ar[2]}`));
        }, 1000);
        return () => {
          clearTimeout(timeSet);
        };
      }
    }
  }, [user2.active, user2.point]);


  // useEffect(()=>{
  //   if(unBlocked==0 ){
  //     navigate('/win')
  //   }
  // },[unBlocked])

  const circleClickHandler = (t) => {
    if (user2.active) {
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
      const affectedSq = affectedSqConnection(firstDot, t, maxSqRow, maxSqCol);

      // gameCtx.updateBlocks(affectedSq);
      dispatch(updateBlocks(affectedSq));
      dispatch(updateCircle({ first: firstDot, second: t }));
      setPreMove(affectedSq.map((ar) => `${ar[0]}${ar[1]}${ar[2]}`));
      setDots([]);
      setFirstClick(true);
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
  return (
    <div>
      <div className={classes.wrapper}>
      <div className={classes.align__box}>
        {/* <Result /> */}
        <div className={classes.users}>
          <div className={classes.user}>
            <h4 style={user1.active ? userActiveStyle : null}>
              you <span className={classes.span}>{user1.point}</span>
            </h4>
          </div>
          <div className={classes.user}>
            <h4 style={user2.active ? userActiveStyle : null}>
              cpu <span className={classes.span}>{user2.point}</span>
            </h4>
          </div>
        </div>
        {/* <button className={classes.next_move} onClick={nextMoveTestHandler}>next move</button> */}
        <div>
          {/* {unBlocked==0 && <h1 className={classes.h1}>the game is over</h1>} */}
        </div>

        {unBlocked === 0 && <PracticeResult name={user1.point >= user2.point ? "you" : "cpu"} back={'cpuGameMenu'}/>}

        {unBlocked !== 0 && (
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
                          backgroundColor:ar.completeSide == 4 ?'rgba(151, 188, 98,0.6)':'none',
                          borderLeft: ar.left ? "1px solid black" : "none",
                          borderRight: ar.right ? "1px solid black" : "none",
                          borderTop: ar.top ? "1px solid black" : "none",
                          borderBottom: ar.bottom ? "1px solid black" : "none",
                        }}
                      >
                        {/* <h1 className={classes.h1}>{`${ar.row}${ar.col}`}</h1> */}
                        {/* <h1
                         style={{color:ar.user === 'user1'?'red':'green'}}
                         >{ar.point===0 ?'':ar.point}</h1> */}
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
                                color: ar.user === "user1" ? "red" : "green",
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
                      onClick={circleClickHandler.bind(this, {
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
                        backgroundColor:dots.includes(`${ar.row}*${ar.col}`)?'red':'rgba(151, 188, 98,0.6)'
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
      </div>
    </div>
  );
}

export default CpuGame;
