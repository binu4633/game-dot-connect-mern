

const findOpposit = (side)=>{
    if(side === 'left'){
      return 'right'
    }else if(side==='right'){
      return 'left'
    }else if(side ==='top'){
      return 'bottom'
    }else if(side === 'bottom'){
      return 'top'
    }
  }

const findUnAttendedSides = (el)=>{
    const sides = [];
    if(!el.left){
      sides.push('left')
    }
    if(!el.right){
      sides.push('right')
    }
    if(!el.top){
      sides.push('top')
    }
    if(!el.bottom){
      sides.push('bottom')
    }
    return sides;
   }
   function find2TosideArray(el){
    const sidesArray = []
    const current = el;
   
    const unattendedSide = findUnAttendedSides(current)[0];
  
    const nextElement = current[`${unattendedSide}Element`];
    if(!nextElement){
      sidesArray.push([current['row'],current['col'],unattendedSide]);
      return sidesArray
    }else{
      sidesArray.push([current['row'],current['col'],unattendedSide]);
      sidesArray.push([nextElement['row'],nextElement['col'],findOpposit(unattendedSide)]);
      return sidesArray
    }
  }

const f2Handler = (f2Array,blocks)=>{
 
  
  
   const block2Chain=  getBlockChain(f2Array,blocks)
  
  
   return  block2Chain.length>0 ? find2TosideArray(block2Chain[0]['el']):[]

   function getBlockChain(blockArray){
    const chainArray = [];
    for(let i=0; i<blockArray.length;i++){
      let chainNum = 0;
      let loopArray = []
      const current = blockArray[i];
      loopArray.push(`${current.row}${current.col}`)
      const unattendedSides = findUnAttendedSides(current);
     
      const nextElementOne = current[`${unattendedSides[0]}Element`];
      const nextElementTwo = current[`${unattendedSides[1]}Element`];

      if(nextElementOne){
        let nextBlockElement = blocks[nextElementOne.row][nextElementOne.col];
       
        if(nextBlockElement.completeSide === 2 ){
           const chainCountOne =  findNextChain(nextBlockElement,unattendedSides[0]);
        }
      }
      if(nextElementTwo){
        let nextBlockElement = blocks[nextElementTwo.row][nextElementTwo.col];
        if(nextBlockElement.completeSide === 2 ){
          loopArray = [];
          loopArray.push(`${current.row}${current.col}`)
           const chainCountTwo =  findNextChain(nextBlockElement,unattendedSides[1]);
        }
      }

   
     chainArray.push({chain:chainNum, el:current})
      function findNextChain(el,side){
       let currentElement = el;
       let prevUnattendedSide = side;
       chainNum++;
     
       if(currentElement.completeSide !== 2 || loopArray.includes(`${currentElement.row}${currentElement.col}`)){
        
         if(loopArray.includes(`${currentElement.row}${currentElement.col}`)){
         
           let ch = chainNum/2;
           chainNum = ch
       
          return chainNum
         }else{
          return chainNum
         }
       
       }
       loopArray.push(`${currentElement.row}${currentElement.col}`)
       let unattendedSides = findUnAttendedSides(el);
        let nextAttendSide = unattendedSides.filter(el=> el !== findOpposit(prevUnattendedSide))[0];
       let nextElementCord = currentElement[`${nextAttendSide}Element`];
       if(nextElementCord === null){
         return chainNum
       }
       let nextElement = blocks[nextElementCord.row][nextElementCord.col]
   
     // return {element:nextElement,prevEntedSide:nextAttendSide}
        findNextChain(nextElement,nextAttendSide)
       
       return chainNum
       }

    }

    if(chainArray.length >1){
      return chainArray.sort((a,b)=>a.chain -b.chain)
    }
    return chainArray;
   
  } 
      

     
}





//  function countChains(el,side,arrayBlocks,ar){
//     let currentElement = el;
//     let prevUnattendedSide = side;
//     const blocks = arrayBlocks;
//     const newAr = [...ar]
//     const arIncludes = ar.includes(`${currentElement.row}${currentElement.col}`)


//     if(currentElement.completeSide !== 2 || arIncludes){
//       return ar
//     }
//      newAr.push(`${currentElement.row}${currentElement.col}`)
//     let unattendedSides = findUnAttendedSides(el);
//     let nextAttendSide = unattendedSides.filter(el=> el !== findOpposit(prevUnattendedSide))[0];
//    let nextElementCord = currentElement[`${nextAttendSide}Element`];
//    if(nextElementCord === null){
//      return ar
//    }else{
//     let nextElement = blocks[nextElementCord.row][nextElementCord.col];
//     countChains(nextElement,nextAttendSide,blocks,newAr)
//    }
 

//  }
// function getBlockChain(f2Array,blocks){
//     const f2Copy = [...f2Array];


//     for(let i=0;i<f2Copy.length; i++){
//       let current = f2Copy[i];
//       const sides = findUnAttendedSides(current)


//         const sideElement1 = current[`${sides[0]}Element`];
//         const sideElement2 = current[`${sides[2]}Element`];
//         let elementBlock1 = sideElement1?  blocks[sideElement1.row][sideElement1.col]:null;
//         let elementBlock2 = sideElement2?  blocks[sideElement2.row][sideElement2.col]:null;

//         if(elementBlock1){
//          const count1 =   countChains(elementBlock1,sides[0],blocks,[`${elementBlock1.row}${elementBlock1.col}`])

//         }
//         if(elementBlock2){
//          const count2 =   countChains(elementBlock2,sides[1],blocks,[`${elementBlock2.row}${elementBlock2.col}`])

//         }
//     }
// }


export {f2Handler}