import { createSlice, current } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";

const initialState = {
  blockArray: [],
  circleArray: [],
  totalBlocks: null,
  rowNums: null,
  colNums: null,
  blockSize: null,
  circleSize: null,
  // user1Count:0,
  // user2Count:0,
  users: null,
  members:null,
  // user1:{active:true,point:0},
  // user2:{active:false,point:0},
  roomSnap: null,
  activeIndex: 0,
  moveNumber: 0,
  filledBlockArray: [],
  disconnectMembers:null,
  disconnectWindow:false,
  isPlaying:false
};

const onlineGameSlice = createSlice({
  name: "onlineGame",
  initialState,
  reducers: {
    isPlayingOn:(state,action)=>{
      state.isPlaying = true
    },
    isPlayingOff:(state,action)=>{
      state.isPlaying = false
    },
    addBlockNums:(state,action)=>{
       const {row,col,size,circleSize} = action.payload;

       state.rowNums = row;
       state.colNums = col;
       state.blockSize = size;
       state.circleSize = circleSize
    },
 
    addSnaps: (state, action) => {
      state.roomSnap = action.payload;
      // const users = [];
      
      // action.payload.members.map((m, i) => {
      //   users.push({
      //     user: m.name,
      //     point: [],
      //     index: i,
      //   });
      // });
      // const members = action.payload.members.map(m=>m.name)
      // state.users = users;
      // state.members = members
    },
    addPlayers:(state,action)=>{
      const users = [];
      
      action.payload.members.map((m, i) => {
        users.push({
          user: m.name,
          point: [],
          index: i,
        });
      });
      const members = action.payload.members.map(m=>m.name)
      state.users = users;
      state.members = members
    },
    restartGame:(state,action)=>{
      state.filledBlockArray =[]
    },
    disconnectOpen:(state,action)=>{
       state.disconnectWindow = true
    },
    disconnectClose:(state,action)=>{
       state.disconnectWindow = false
    },
    addDisconnectMembers:(state,action)=>{
      const members = action.payload;
      state.disconnectMembers = members;
      // state.members = members // check this tis is verry contriversal

    },
    continueGame:(state,action)=>{
     
       const copyUsers = [...current(state.users)]
       
      //  const memberArray = copyUsers.members;
     

       const disconnectMembersArray = state.disconnectMembers;

       if(disconnectMembersArray){
        const filtered = copyUsers.filter(m=>{
          if(!disconnectMembersArray.includes(m.user)){
             return m
           }
          });
          // copyUsers.members = filtered;
        
          state.users = filtered.map((f,i)=>{
            const user = {...f}
            user.index = i;
            return user
          })
       }else{
        state.users = copyUsers
       }
      
    },
    deleteDisconnectMembers:(state,action)=>{
    
      state.disconnectMembers = []
    },
    createBlocks: (state, action) => {
      const topArray = [];
      const rowSize = state.rowNums;
      const columnSize = state.colNums;
      // const rowSize = action.payload.maxRow
      // const columnSize = action.payload.maxCol
      for (let i = 0; i <= rowSize; i++) {
        const arr = [];
        for (let j = 0; j <= columnSize; j++) {
          arr.push({
            row: i,
            col: j,
            topElement: i - 1 < 0 ? null : { row: i - 1, col: j },
            bottomElement: i + 1 > rowSize ? null : { row: i + 1, col: j },
            leftElement: j - 1 < 0 ? null : { row: i, col: j - 1 },
            rightElement: j + 1 > columnSize ? null : { row: i, col: j + 1 },
            top: false,
            bottom: false,
            left: false,
            right: false,
            completeSide: 0,
            user: null,
            point: 0,
            userIndex: null,
          });
        }
        topArray.push(arr);
      }
      state.blockArray = topArray;
      state.totalBlocks = (rowSize + 1) * (columnSize + 1);
      state.disconnectWindow = false
      
    },
    createCircle: (state, action) => {
      const circleArr = [];
      const circleRowSize = state.rowNums + 1;
      const circleColumnSize = state.colNums + 1;
      // const circleRowSize = action.payload.maxRowSize
      // const circleColumnSize = action.payload.maxColSize

      for (let i = 0; i <= circleRowSize; i++) {
        const arr = [];
        for (let j = 0; j <= circleColumnSize; j++) {
          arr.push({
            row: i,
            col: j,
            left: false,
            right: false,
            top: false,
            bottom: false,
            //    topElement:i-1 <0 ? null :{row:i-1,col:j},
            //    bottomElement:i+1 >rowSize ? null :{row:i+1,col:j},
            //    leftElement:j-1<0 ? null: {row:i,col:j-1},
            //    rightElement:j+1>columnSize ? null: {row:i,col:j+1}
          });
        }
        circleArr.push(arr);
      }
      state.circleArray = circleArr;
    },
    updateBlocks: (state, action) => {
      const currentArray = [...current(state.blockArray)];

      const updateInfoData = action.payload.affectedSq;
      const activeIndexNum = action.payload.activeIndexNum;
      const moveNumber = action.payload.moveNumber;
      if (updateInfoData.length > 0) {
        updateInfoData.map((arr) => {
          // const currentElement = currentArray[arr[0]][arr[1]]
          const elementFirst = [...currentArray[arr[0]]];
          const elementSecond = { ...elementFirst[arr[1]] };
          // if(elementSecond[arr[2]] === true){

          // }
          elementSecond[arr[2]] = true;
          elementSecond["completeSide"] =
            (elementSecond["left"] ? 1 : 0) +
            (elementSecond["right"] ? 1 : 0) +
            (elementSecond["top"] ? 1 : 0) +
            (elementSecond["bottom"] ? 1 : 0);

          if (elementSecond["completeSide"] === 4) {
       
            //  state.totalBlocks = state.totalBlocks -1;
            const block = `${arr[0]}${arr[1]}`;
            if (!state.users[state.activeIndex].point.includes(block)) {
              state.users[state.activeIndex].point.push(block);
            }
            if (!state.filledBlockArray.includes(block)) {
              state.filledBlockArray.push(block);
            }

            let userArray = [...state.users];

            const pointer = { ...userArray[state.activeIndex] };

            //  pointer.point = Number(pointer.point) +1;
          
            userArray[state.activeIndex] = pointer;
            elementSecond["user"] = pointer.user;
            elementSecond["point"] = pointer.point.length;
            elementSecond["userIndex"] = state.activeIndex;
            state.users = userArray;
            //  if(state.user1.active){
            //   const user1 = {...state.user1}
            //   user1.point = user1.point +1;
            //   elementSecond['user'] = 'user1';
            //   elementSecond['point'] =  user1.point;
            //   state.user1 = user1;
            //  }else{
            //   const user2 = {...state.user2}
            //   user2.point = user2.point +1;
            //   elementSecond['user'] = 'user2';
            //   elementSecond['point'] =  user2.point
            //   state.user2 = user2;
            //  }
          }
          elementFirst[arr[1]] = elementSecond;
          currentArray[arr[0]] = elementFirst;
        });

        const doSwitch = updateInfoData.some(
          (arr) => currentArray[arr[0]][arr[1]]["completeSide"] === 4
        );
        if (!doSwitch) {
          let activeIndex = activeIndexNum;
          const maxUser =  state.users? state.users.length - 1 :null;
          //  activeIndex += 1;
          //  console.log('active index reducer', activeIndex)
          if (activeIndexNum === maxUser) {
            activeIndex = 0;
          } else {
            activeIndex += 1;
          }
          state.activeIndex = activeIndex;
          // const user1 = {...state.user1}
          // const user2 = {...state.user2}
          //     if(user1.active){
          //       user1.active = false
          //       user2.active = true
          //    }else if(user2.active){
          //      user1.active = true
          //      user2.active = false
          //    }
          //    state.user1 = user1;
          //    state.user2 = user2;
        }
      }
      state.blockArray = currentArray;
      // return 'hiiiii'
    },
    updateCircle: (state, action) => {
     
      const first = action.payload.first;
      const second = action.payload.second;
   
      const currentArray = [...current(state.circleArray)];
      // console.log('curent array', currentArray)
      if (first.row === second.row) {
        if (Number(first.col) < Number(second.col)) {
         
          const elementFirstFirst = [...currentArray[first.row]];
          const elementFirstSecond = { ...elementFirstFirst[first.col] };
          elementFirstSecond["right"] = true;
        
          elementFirstFirst[first.col] = elementFirstSecond;
          currentArray[first.row] = elementFirstFirst;
          const elementSecondFirst = [...currentArray[second.row]];
          const elementSecondSecond = { ...elementSecondFirst[second.col] };
          elementSecondSecond["left"] = true;

          elementSecondFirst[second.col] = elementSecondSecond;
          currentArray[second.row] = elementSecondFirst;
          // currentArray[first.row][first.col]['right'] = true;
          // currentArray[second.row][second.col]['left'] = true;
        } else if (Number(first.col) > Number(second.col)) {
          const elementFirstFirst = [...currentArray[first.row]];
          const elementFirstSecond = { ...elementFirstFirst[first.col] };
          elementFirstSecond["left"] = true;

          elementFirstFirst[first.col] = elementFirstSecond;
          currentArray[first.row] = elementFirstFirst;
          const elementSecondFirst = [...currentArray[second.row]];
          const elementSecondSecond = { ...elementSecondFirst[second.col] };
          elementSecondSecond["right"] = true;

          elementSecondFirst[second.col] = elementSecondSecond;
          currentArray[second.row] = elementSecondFirst;

          // currentArray[first.row][first.col]['left'] = true;
          // currentArray[second.row][second.col]['right'] = true;
        }
      } else if (first.col === second.col) {
        if (Number(first.row) < Number(second.row)) {
          const elementFirstFirst = [...currentArray[first.row]];
          const elementFirstSecond = { ...elementFirstFirst[first.col] };
          elementFirstSecond["bottom"] = true;

          elementFirstFirst[first.col] = elementFirstSecond;
          currentArray[first.row] = elementFirstFirst;
          const elementSecondFirst = [...currentArray[second.row]];
          const elementSecondSecond = { ...elementSecondFirst[second.col] };
          elementSecondSecond["top"] = true;

          elementSecondFirst[second.col] = elementSecondSecond;
          currentArray[second.row] = elementSecondFirst;
          // currentArray[first.row][first.col]['bottom'] = true;
          // currentArray[second.row][second.col]['top'] = true;
        } else if (Number(first.row) > Number(second.row)) {
          const elementFirstFirst = [...currentArray[first.row]];
          const elementFirstSecond = { ...elementFirstFirst[first.col] };
          elementFirstSecond["top"] = true;

          elementFirstFirst[first.col] = elementFirstSecond;
          currentArray[first.row] = elementFirstFirst;
          const elementSecondFirst = [...currentArray[second.row]];
          const elementSecondSecond = { ...elementSecondFirst[second.col] };
          elementSecondSecond["bottom"] = true;

          elementSecondFirst[second.col] = elementSecondSecond;
          currentArray[second.row] = elementSecondFirst;
          // currentArray[first.row][first.col]['top'] = true;
          // currentArray[second.row][second.col]['bottom'] = true;
        }
      }
      state.circleArray = currentArray;
   
    },
  },
});

export const {
  
  createBlocks,
  createCircle,
  updateBlocks,
  updateCircle,
  addBlockNums,
  addSnaps,
  addPlayers,
  restartGame,
  disconnectClose,
  disconnectOpen,
  addDisconnectMembers,
  deleteDisconnectMembers,
  continueGame,
  isPlayingOn,
  isPlayingOff
} = onlineGameSlice.actions;

export default onlineGameSlice.reducer;
