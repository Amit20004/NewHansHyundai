import React from "react";
import "../../css/Button.css";
function Button({btnName, color, func}) {
  return (
    <div>
     <a  class="btn outlined " style={{color:color}} onClick={func}>{btnName}</a>

    </div>
  );
}

export default Button;
