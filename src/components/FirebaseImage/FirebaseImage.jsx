import React, { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import clasess from "./firebaseImage.module.scss";
import { Skeleton } from "antd";

const FirebaseImageByName = ({ imageName, alt, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      // Проверка кэша в localStorage
      const cachedUrl = localStorage.getItem(imageName);
      if (cachedUrl) {
        setImageUrl(cachedUrl);
        setLoading(false);
        return;
      }

      const storage = getStorage();
      const imageRef = ref(storage, imageName);

      try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);

        // Сохранение URL в localStorage для кэширования
        localStorage.setItem(imageName, url);
      } catch (error) {
        console.error("Ошибка при загрузке изображения:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();

    // Очистка кэша при размонтировании компонента
    return () => {
      setImageUrl(null); // Сброс URL при размонтировании
      setLoading(true); // Вернуть состояние загрузки
    };
  }, [imageName]);

  if (loading) {
    return (
      <Skeleton.Avatar
        active
        size="large"
        shape="circle"
        className={clasess.customSkeleton}
      />
    );
  }

  return <img className={className} src={imageUrl} alt={alt} />;
};

export default FirebaseImageByName;
