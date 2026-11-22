import React from "react";
import "../styles/loading.scss";

function Loading({ text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default Loading;