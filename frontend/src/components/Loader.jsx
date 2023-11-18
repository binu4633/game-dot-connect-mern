import React from "react";
import classess from "./loader.module.css";
function Loader() {
  return (
    <div className={classess.wrapper}>
      <div className={classess.main}>
     
         <div className={classess.sq1}></div>
         <div className={classess.sq2}></div>
 
      </div>
    </div>
  );
}

export default Loader;
