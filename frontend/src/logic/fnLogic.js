const possibleConnection = (t)=>{
    let row = Number(t.row);
    let col = Number(t.col);
    let left = t.left;
    let right = t.right;
    let top = t.top;
    let bottom = t.bottom;
    let maxCol = Number(t.colMax);
    let maxRow = Number(t.rowMax);

    const tempArray = [
       !top&& [row-1, col],
      !left &&  [row, col-1],
      !bottom && [row+1,col],
      !right && [row,col+1]
    ];
    
   const filteredArray = tempArray.filter(a=>a[0]>=0 && a[1]>=0).filter(a=>a[0]<=maxRow && a[1]<=maxCol);

   const toString = [];
   
   for(let i=0;i<filteredArray.length;i++){
      toString.push(`${filteredArray[i][0]}*${filteredArray[i][1]}`)
   }

    return toString
}

const isPossibleConnetion = (t,dots)=>{
 
    const isvalid = dots.includes(`${t.row}*${t.col}`);
  return isvalid

}

const affectedSqConnection = (first,second,maxRow,maxCol)=>{
  const firstDot = first;
  const secondDot = second;
  const topRow = maxRow;
  const topCol = maxCol;

  if(firstDot.row === secondDot.row){
    
    let pivot ;
    if(Number(firstDot.col)<Number(secondDot.col)){
     pivot = firstDot
    
    }else{
      pivot = secondDot;
     
    }
    
    const affectedSq = [[Number(pivot.row)-1,Number(pivot.col), 'bottom'],[Number(pivot.row),Number(pivot.col), 'top']]
    const filteredArray = affectedSq.filter(a=>a[0]>=0 && a[1]>=0).filter(a=>a[0]<=maxRow && a[1]<=maxCol);
    return filteredArray
  }else if(firstDot.col === secondDot.col){
   
    let pivot ;
    if(Number(firstDot.row)<Number(secondDot.row)){
     pivot = firstDot
     
    }else{
      pivot = secondDot;
     
    }
  
    const affectedSq = [[Number(pivot.row),Number(pivot.col)-1, 'right'],[Number(pivot.row),Number(pivot.col), 'left']]
    const filteredArray = affectedSq.filter(a=>a[0]>=0 && a[1]>=0).filter(a=>a[0]<=maxRow && a[1]<=maxCol);

    return filteredArray
  }
  
}

const affectedCircles = (blocks, circleArray)=>{
 
  const block1 = blocks[0];
  const circles = circleArray
   const arr = []
 
  if(block1[2] === 'right'){
     arr.push([block1[0],block1[1]+1])
     arr.push([block1[0]+1,block1[1]+1])
  }else if(block1[2] === 'left'){
    arr.push([block1[0],block1[1]])
    arr.push([block1[0]+1,block1[1]])
 }else if(block1[2] === 'bottom'){
  arr.push([block1[0]+1,block1[1]])
  arr.push([block1[0]+1,block1[1]+1])
}else if(block1[2] === 'top'){
  arr.push([block1[0],block1[1]])
  arr.push([block1[0],block1[1]+1])
}

 
  const obj = {
    first:circles[arr[0][0]][arr[0][1]],
    second:circles[arr[1][0]][arr[1][1]],
  }
  
   return obj
}


export {possibleConnection,isPossibleConnetion,affectedSqConnection,affectedCircles}