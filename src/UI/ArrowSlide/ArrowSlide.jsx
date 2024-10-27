import React from "react";
import FirebaseImageByName from "../../components/FirebaseImage/FirebaseImage"; // Импортируем компонент для изображения из Firebase

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <FirebaseImageByName imageName="icon-arrowSlide.png" alt="Next Arrow" />
    </div>
  );
};

export default NextArrow; // Экспортируем как default
