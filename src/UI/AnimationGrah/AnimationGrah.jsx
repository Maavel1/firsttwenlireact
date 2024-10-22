// AnimationGrah.jsx
import React, { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; // Стили для скелетона

const AnimationGrah = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src="https://lottie.host/11d2c8c7-15e8-4b16-9832-4faac1f8b6b3/IdDTBGHYX5.json"
        style={{ height: "510px", width: "550px" }}
      ></Player>
    </div>
  );
};

export default AnimationGrah;
