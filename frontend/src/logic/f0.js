
function findNoTwoLinkedSide(blockArray,blocks){

    const arr = [];
   for(let i = 0; i<blockArray.length; i++){
     const current = blockArray[i];

     if(current['leftElement'] === null){
       // arr.push({side:'left', element:current})
       arr.push([current['row'],current['col'],'left'])
    
       break
     }
     if(current['topElement'] === null){
       // arr.push({side:'top', element:current})
       arr.push([current['row'],current['col'],'top'])
       break
     }
     if(current['rightElement'] === null){
       // arr.push({side:'right', element:current})
       arr.push([current['row'],current['col'],'right'])
       break
     }
    
     if(current['bottomElement'] === null){
       // arr.push({side:'bottom', element:current})
       arr.push([current['row'],current['col'],'bottom'])
       break
     }
     
     if(current['leftElement']){
       const next = blocks[current['leftElement']['row']][current['leftElement']['col']];
     
        if(next['completeSide']<2){
         arr.push([current['row'],current['col'],'left'])
         arr.push([next['row'],next['col'],'right'])
         break
        }
     }
     if(current['bottomElement']){
       const next = blocks[current['bottomElement']['row']][current['bottomElement']['col']];
        if(next['completeSide'] <2){
         arr.push([current['row'],current['col'],'bottom'])
         arr.push([next['row'],next['col'],'top'])
         break
        }
     }
     if(current['rightElement']){
       const next = blocks[current['rightElement']['row']][current['rightElement']['col']];
        if(next['completeSide'] <2){
         arr.push([current['row'],current['col'],'right'])
         arr.push([next['row'],next['col'],'left'])
         break
        }
     }
     if(current['topElement']){
       const next = blocks[current['topElement']['row']][current['topElement']['col']];
        if(next['completeSide'] <2){
         arr.push([current['row'],current['col'],'top'])
         arr.push([next['row'],next['col'],'bottom'])
         break
        }
     }
   

   
   }


   return arr

 }

const f0Handler = (f0Array, blocks)=>{
  const f0Copy = [...f0Array];
  
  const addRandom = f0Copy.map(co=>{
    return{num:Math.round(Math.random()*100),el:co}
  })

  const sortRandom = addRandom.sort((a,b)=>a.num-b.num);
 
  const reshapeRandom = sortRandom.map(sr=>sr.el);
 
  return findNoTwoLinkedSide(reshapeRandom, blocks);

  
}

export {f0Handler}