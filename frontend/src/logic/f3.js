
const findUnattendedSide = (el)=>!el.left ? 'left' : !el.right ?'right':!el.top?'top':'bottom';
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
const f3Handler = (block,arrayBlocks)=>{
    const arr = [];
    
    
    const side = findUnattendedSide(block);
  
    if(block[`${side}Element`] === null){
        arr.push([block.row,block.col,side])
    }else{
        const nextElement = block[`${side}Element`];
        arr.push([block.row,block.col,side])
        arr.push([nextElement.row,nextElement.col,findOpposit(side)])
    }


    return arr
   

}



export {f3Handler}