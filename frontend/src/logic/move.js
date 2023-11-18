import {f3Handler} from './f3'
import {f0Handler} from './f0';
import {f1Handler} from './f1';
import { f2Handler} from './f2'

const nextMove = (blocks)=>{
    let returnArr = []
    const find3 = blocks.flat().filter(ar=>ar.completeSide === 3);
   
  
    if(find3.length>0){
      returnArr = f3Handler(find3[0],blocks);
    }else{
        const find0 = blocks.flat().filter(ar=>ar.completeSide === 0);
        let f0Results = [];
        if(find0.length >0){
            f0Results  =  f0Handler(find0, blocks);
          
            returnArr = f0Results
        }

        if(!find0.length >0 || !f0Results.length >0){
            const find1 = blocks.flat().filter(ar=>ar.completeSide === 1);
          
            // let f1Results = [];
         
            if(find1.length >0){
                returnArr =  f1Handler(find1,blocks)
            }else{
                const find2 = blocks.flat().filter(ar=>ar.completeSide === 2);
                returnArr = f2Handler(find2, blocks)
            }
            
           
        }
        

      
}

    return returnArr
}

export {nextMove}