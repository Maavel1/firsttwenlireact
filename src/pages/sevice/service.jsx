import { useState, useEffect } from "react";
import Loader from "../../UI/Loader/loader";
import { db } from "../../base/base";
import { collection, getDocs } from "firebase/firestore";
import Slider from "react-slick"; // Импорт слайдера
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import clasess from "./service.module.scss";
import LinkNavigation from "../../UI/LinkNavigation/LinkNavigation";
import ByuButton from "../../UI/BuyButton/ByuButton";

const ImageSlider = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const renderRating = (rating) => {
    if (rating === undefined) {
      return "Не установлен";
    }

    const stars = Array(5)
      .fill(0)
      .map((_, index) => (
        <span
          key={index}
          className={index < rating ? "filled-star" : "empty-star"}
        >
          ★
        </span>
      ));

    return <div>{stars}</div>;
  };

  return (
    <div className={clasess.serviceContainer}>
      <Slider className={clasess.slider} {...settings}>
        {items.map((item) => (
          <div className={clasess.sliderFireAct} key={item.id}>
            <div className={clasess.rowsSlide}>
              <div className={clasess.infoProductSlide}>
                <h2 className={clasess.nameSlideProduct}>{item.name}</h2>
                <h3> {item.description}</h3>
                <div className={clasess.categuryAndRating}>
                  <p>
                    Рейтинг <span>{renderRating(item.rating)}</span>
                  </p>
                  <p>
                    Категория <span> - {item.category}</span>
                  </p>
                </div>
                <div className={clasess.priceAndBtn}>
                  <ByuButton />
                  <h3>{`${item.price.toLocaleString()} ₸`}</h3>
                </div>
              </div>
              <div className={clasess.imgSlide}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Компонент Service для получения данных и отображения слайдеров
const Service = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const slidesPerGroup = 3; // Количество слайдов в каждой группе

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "service"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Функция для группировки данных
  const groupItems = (items, groupSize) => {
    const grouped = [];
    for (let i = 0; i < items.length; i += groupSize) {
      grouped.push(items.slice(i, i + groupSize));
    }
    return grouped;
  };

  // Группировка данных для слайдеров
  const groupedData = groupItems(data, slidesPerGroup);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        groupedData.map((group, index) => (
          <ImageSlider key={index} items={group} />
        ))
      )}
    </div>
  );
};

export default Service;
