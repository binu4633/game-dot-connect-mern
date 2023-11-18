
function findNoOnesNoTwoLinkedSide(blockArray,blocks){
    
    const arr = [];
   for(let i = 0; i<blockArray.length; i++){
     const current = blockArray[i];
   
      const unattendedSides = findUnAttendedSides(current)
      
       const nullAttendedSide = unattendedSides.find(s=>{
       
        if(current[`${s}Element`] == null) return s
       })
   
       if(nullAttendedSide){
         arr.push({side:nullAttendedSide, element:current})
         break
       }

       const noTwoSideAttended = unattendedSides.find(s=>{
         const nextCord = current[`${s}Element`]
         const next = blocks[nextCord['row']][nextCord['col']]
         if(next['completeSide'] <2) return s
       })
       if(noTwoSideAttended ){
         arr.push({side:noTwoSideAttended, element:current})
         break
       }
  
 }

  
   return arr

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
   function find1ToSideArray(el){
    const sidesArray =[]
    const side1 = el['side'];
    const element1 = el['element'];
 
    const nextElement = element1[`${side1}Element`];

    if(!nextElement){
      sidesArray.push([element1['row'],element1['col'],side1]);
    
       return sidesArray
    }
    if(nextElement){
      sidesArray.push([element1['row'],element1['col'],side1])
      sidesArray.push([nextElement['row'],nextElement['col'],findOpposit(side1)]);
  
      return sidesArray
    }
   }
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


const f1Handler = (f1Array,blocks)=>{
    let f1Results =[];
    const f1Copy = [...f1Array];
  
    const addRandom = f1Copy.map(co=>{
      return{num:Math.round(Math.random()*100),el:co}
    })
  
    const sortRandom = addRandom.sort((a,b)=>a.num-b.num);
   
    const reshapeRandom = sortRandom.map(sr=>sr.el);
    const sideOnenoTwoLinkedSide = findNoOnesNoTwoLinkedSide(reshapeRandom,blocks)
    
    if(sideOnenoTwoLinkedSide && sideOnenoTwoLinkedSide.length>0){
       f1Results = find1ToSideArray(sideOnenoTwoLinkedSide[0])
      }else{
        const el = f1Array[0]
        const side = findUnAttendedSides(el);
        
        f1Results = find1ToSideArray({side:side[0],element:el})
      }
    return f1Results
   
}


export {f1Handler}