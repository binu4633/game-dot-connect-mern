import React,{useRef,useEffect} from 'react'

const Canvas = props =>{
    const canvasRef = useRef(null);
   const starArray=[];
    // if(!canvas) return
    const getRandomColor = ()=>`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    const star = function(x,y,radius,dx,dy,color){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.dx=dx;
        this.dy=dy;
        this.color = color
    
        this.draw= function(context){
            context.beginPath();
            context.arc(this.x,this.y,this.radius,0,Math.PI*2);
            context.strokeStyle=this.color
            
            context.stroke();
            context.closePath();
        }
       
        this.update=function(canvas,context){
          /* if(this.x<innerWidth/2){
                this.dx=this.dx*(-1);
               // this.dy*=-1;
            }*/
         const firstPoint={
             x:this.x,y:this.y
         };
            if(this.x-this.radius>window.innerWidth||this.x-this.radius<0){
                  this.x= canvas.width/2;
                  this.y= canvas.height/2;
                 // this.y=canvas.width;
                  this.radius=0.9;
              }
              if(this.y-this.radius>window.innerHeight||this.y-this.radius<0){
                this.x= canvas.width/2;
                this.y= canvas.height/2;
                  this.radius=0.9;
              }
       
    // if(this.x<window.innerWidth/2){
    //     this.x-=this.dx
    // }else{
    //     this.x+=this.dx;
    // }
    
            this.x+= this.dx*1;
            this.y+=this.dy*1;
            this.radius+=0.01*2;
            // if(this.radius<1.75){
            //     this.radius+=1;
            // }
           
    
            this.draw(context);
        
        }
       
    }

    function init(canvas,context){
        
        for(var i=0;i<250;i++){
            const random = Math.random()
        //    var  x=canvas.width/2;
           // var  x=canvas.width/2+((Math.random()-0.5)*200);
           var  x=canvas.width/2+((random-0.5)*200);
        //    var x=canvas.width*Math.random();
           var  y = canvas.height/2;
           // var  y = canvas.height/1.5+((Math.random()-0.5)*200);
           var  y = canvas.height/1.5+((random-0.5)*200);
        //    var y=canvas.height*Math.random();
            var radius=3*Math.random();
            var dx=(0.5 - Math.random())*2.5;
            // var dx=(0.5 - random)*2.5;
            var dy=(0.5 - Math.random())*2.5;
            // var dy=(0.5 - random)*2.5;
            var color = getRandomColor()
    
            starArray.push(new star(x,y,radius,dx,dy,color));
    
        }
    
    }


    
    useEffect(()=>{
        const canvas = canvasRef.current;
        
        if(canvas){
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight
            const context = canvas.getContext('2d');

            init(canvas,context)
            function animate(){
                // context.clearRect(0, 0,canvas.width,canvas.height);
                context.clearRect(0, 0,window.innerWidth,window.innerHeight);
                
                for(var i=0;i<starArray.length;i++){
                    starArray[i].update(canvas,context);
                }
                requestAnimationFrame(animate);
              }
            animate(canvas,context)
        }
          
       
    },[])
  
  
    return <canvas ref={canvasRef}  {...props}/>
} 


export default Canvas