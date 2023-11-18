import {createSlice,current} from '@reduxjs/toolkit';


const initialState = {
    blockArray:[],
    circleArray:[],
    totalBlocks:null,
    rowNums:null,
    colNums:null,
    blockSize:null,
    circleSize:null,
    // user1Count:0,
    // user2Count:0,
    user1:{active:true,point:0},
    user2:{active:false,point:0},
}

const practiceGameSlice = createSlice({
    name:'game',
    initialState,
    reducers:{
        addBlockNums:(state,action)=>{
           const {row,col,size,circleSize} = action.payload;   
          //  console.log('rreucerr', row,col,size)
           state.rowNums = row;
           state.colNums = col;
           state.blockSize = size;
           state.circleSize = circleSize
        },
        createBlocks:(state,action)=>{
            const topArray = [];
            const rowSize = state.rowNums
            const columnSize = state.colNums
            // const rowSize = action.payload.maxRow
            // const columnSize = action.payload.maxCol
            for(let i=0;i<=rowSize;i++){
            const arr= [];
            for(let j=0;j<=columnSize;j++){
       
            arr.push({
               row:i,
               col:j,
               topElement:i-1 <0 ? null :{row:i-1,col:j},
               bottomElement:i+1 >rowSize ? null :{row:i+1,col:j},
               leftElement:j-1<0 ? null: {row:i,col:j-1},
               rightElement:j+1>columnSize ? null: {row:i,col:j+1},
               top:false,
               bottom:false,
               left:false,
               right:false,
               completeSide:0,
               user:null,
               point:0,
             })
            }
            topArray.push(arr)
            }
            state.blockArray = topArray;
            state.totalBlocks = (rowSize+1)*(columnSize+1);
            state.user1 = {active:true,point:0};
            state.user2 = {active:false,point:0}
            // console.log('stae block array redux',  state.blockArray)
        },
        createCircle:(state,action)=>{
            const circleArr = [];
            const circleRowSize = state.rowNums+1
            const circleColumnSize = state.colNums+1
            // const circleRowSize = action.payload.maxRowSize
            // const circleColumnSize = action.payload.maxColSize
      
            for(let i=0;i<=circleRowSize;i++){
             const arr= [];
              for(let j=0;j<=circleColumnSize;j++){
         
                arr.push({
                   row:i,
                   col:j,
                   left:false,
                   right:false,
                   top:false,
                   bottom:false
                 //    topElement:i-1 <0 ? null :{row:i-1,col:j},
                 //    bottomElement:i+1 >rowSize ? null :{row:i+1,col:j},
                 //    leftElement:j-1<0 ? null: {row:i,col:j-1},
                //    rightElement:j+1>columnSize ? null: {row:i,col:j+1}
                })
              }
             circleArr.push(arr)
              }
           state.circleArray = circleArr   
        //    console.log('stae circular array redux',  state.circleArray)
        },
        updateBlocks:(state,action)=>{
            const currentArray = [...current(state.blockArray)];
         
   
            const updateInfoData = action.payload;
         
            if(updateInfoData.length >0){
              updateInfoData.map(arr=>{
               
                // const currentElement = currentArray[arr[0]][arr[1]]
                const elementFirst = [...currentArray[arr[0]]];
                const elementSecond = {...elementFirst[arr[1]]}
                // if(elementSecond[arr[2]] === true){
                  
                // }
                elementSecond[arr[2]] = true;
                elementSecond['completeSide'] =
                (elementSecond['left'] ? 1 :0)+
                (elementSecond['right'] ? 1 :0)+
                (elementSecond['top'] ? 1 :0)+
                (elementSecond['bottom'] ? 1 :0)
               
               if(elementSecond['completeSide'] === 4){
                     state.totalBlocks = state.totalBlocks -1
                     if(state.user1.active){
                      const user1 = {...state.user1}
                      user1.point = user1.point +1;
                      elementSecond['user'] = 'user1';
                      elementSecond['point'] =  user1.point;
                      state.user1 = user1;
                     }else{
                      const user2 = {...state.user2}
                      user2.point = user2.point +1;
                      elementSecond['user'] = 'user2';
                      elementSecond['point'] =  user2.point
                      state.user2 = user2;
                     }
          
               }
               elementFirst[arr[1]] = elementSecond;
               currentArray[arr[0]] = elementFirst;


               })
      
             const doSwitch = updateInfoData.some(arr=>currentArray[arr[0]][arr[1]]['completeSide'] === 4)
               if(!doSwitch){
            
                const user1 = {...state.user1}
                const user2 = {...state.user2}
                    if(user1.active){
                      user1.active = false
                      user2.active = true
                   }else if(user2.active){
                     user1.active = true
                     user2.active = false
                   }
                   state.user1 = user1;
                   state.user2 = user2;
               }
            }
            state.blockArray = currentArray;
            // return 'hiiiii'
          
        }, 
        updateCircle:(state,action)=>{
          // console.log('action paylod', action.payload)
          const first = action.payload.first;
          const second = action.payload.second;
          // console.log('updateCirle', first,second);
          // console.log('first', first)
          // console.log('second', second)
          const currentArray = [...current(state.circleArray)];
          // console.log('curent array', currentArray)
          if(first.row === second.row){
          
            if(Number(first.col) < Number(second.col)){
              // console.log('this is workig')
              const elementFirstFirst = [...currentArray[first.row]];
              const elementFirstSecond = {...elementFirstFirst[first.col]}
              elementFirstSecond['right'] = true;
              // console.log('elementFirstSecond',elementFirstSecond)
              elementFirstFirst[first.col] = elementFirstSecond;
               currentArray[first.row] = elementFirstFirst;
               const elementSecondFirst = [...currentArray[second.row]];
               const elementSecondSecond = {...elementSecondFirst[second.col]}
               elementSecondSecond['left'] = true;
               
               elementSecondFirst[second.col] = elementSecondSecond;
                currentArray[second.row] = elementSecondFirst;
              // currentArray[first.row][first.col]['right'] = true;
              // currentArray[second.row][second.col]['left'] = true;
            }else if(Number(first.col) > Number(second.col)){
              const elementFirstFirst = [...currentArray[first.row]];
              const elementFirstSecond = {...elementFirstFirst[first.col]}
              elementFirstSecond['left'] = true;
              
              elementFirstFirst[first.col] = elementFirstSecond;
               currentArray[first.row] = elementFirstFirst;
               const elementSecondFirst = [...currentArray[second.row]];
               const elementSecondSecond = {...elementSecondFirst[second.col]}
               elementSecondSecond['right'] = true;
               
               elementSecondFirst[second.col] = elementSecondSecond;
                currentArray[second.row] = elementSecondFirst;
              
              // currentArray[first.row][first.col]['left'] = true;
              // currentArray[second.row][second.col]['right'] = true;
            }
         }else if(first.col === second.col){
          if(Number(first.row) < Number(second.row)){
            const elementFirstFirst = [...currentArray[first.row]];
            const elementFirstSecond = {...elementFirstFirst[first.col]}
            elementFirstSecond['bottom'] = true;
            
            elementFirstFirst[first.col] = elementFirstSecond;
             currentArray[first.row] = elementFirstFirst;
             const elementSecondFirst = [...currentArray[second.row]];
             const elementSecondSecond = {...elementSecondFirst[second.col]}
             elementSecondSecond['top'] = true;
             
             elementSecondFirst[second.col] = elementSecondSecond;
              currentArray[second.row] = elementSecondFirst;
            // currentArray[first.row][first.col]['bottom'] = true;
            // currentArray[second.row][second.col]['top'] = true;
          }else if(Number(first.row) > Number(second.row)){
            const elementFirstFirst = [...currentArray[first.row]];
            const elementFirstSecond = {...elementFirstFirst[first.col]}
            elementFirstSecond['top'] = true;
            
            elementFirstFirst[first.col] = elementFirstSecond;
             currentArray[first.row] = elementFirstFirst;
             const elementSecondFirst = [...currentArray[second.row]];
             const elementSecondSecond = {...elementSecondFirst[second.col]}
             elementSecondSecond['bottom'] = true;
             
             elementSecondFirst[second.col] = elementSecondSecond;
              currentArray[second.row] = elementSecondFirst;
            // currentArray[first.row][first.col]['top'] = true;
            // currentArray[second.row][second.col]['bottom'] = true;
          }
         }
         state.circleArray = currentArray;
         console.log('state circle', state.circleArray)
        }
    }
})


export const {createBlocks,createCircle,updateBlocks,updateCircle,addBlockNums} = practiceGameSlice.actions;

export default practiceGameSlice.reducer;

