import React, { useState } from "react";

export default function order() {
  const [services, setServices] = useState([]);
  const [bonusPoints, setBonusPoints] = useState(100); // Пример начального количества бонусов
  const [selectedBonus, setSelectedBonus] = useState(0);

  // Пример услуги
  const exampleService = {
    id: 1,
    name: "Услуга 1",
    price: 50,
  };

  const addService = () => {
    setServices([...services, exampleService]);
  };

  const removeService = (id) => {
    setServices(services.filter((service) => service.id !== id));
  };

  const totalCost = services.reduce(
    (total, service) => total + service.price,
    0
  );
  const finalCost = totalCost - selectedBonus;

  const handleBonusChange = (e) => {
    const value = Math.min(Number(e.target.value), bonusPoints);
    setSelectedBonus(value);
  };

  const handleSubmit = () => {
    if (finalCost <= 0) {
      // Здесь можно добавить логику для завершения покупки
      alert("Покупка завершена!");
      setServices([]); // Очистка корзины после покупки
      setSelectedBonus(0);
    } else {
      alert(`Необходимо оплатить: ${finalCost} рублей`);
    }
  };
  return (
    <>
      <h1>Корзина</h1>
      <button onClick={addService}>Добавить услугу</button>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.name} - {service.price} рублей
            <button onClick={() => removeService(service.id)}>Удалить</button>
          </li>
        ))}
      </ul>
      <h2>Общая стоимость: {totalCost} рублей</h2>
      <h2>Ваши бонусы: {bonusPoints}</h2>
      <input
        type="number"
        value={selectedBonus}
        onChange={handleBonusChange}
        placeholder="Использовать бонусы"
      />
      <button onClick={handleSubmit}>Оплатить</button>
      <h2>Сумма к оплате: {finalCost} рублей</h2>
    </>
  );
}
