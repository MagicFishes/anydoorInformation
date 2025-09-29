// HotelList.js
import React, { memo } from 'react';

// 通过 memo 优化性能，避免不必要的重新渲染
type Hotel = {
  id: string | number;
  name: string;
  location: string;
  rating: number;
};

type HotelListProps = {
  hotels: Hotel[];
  onHotelClick: (hotel: Hotel) => void;
};

const HotelList = memo(({ hotels, onHotelClick }: HotelListProps) => {
  return (
    <div>
      <h2>酒店列表</h2>
      <ul>
        {hotels.map(hotel => (
          <li key={hotel.id} onClick={() => onHotelClick(hotel)}>
            <h3>{hotel.name}</h3>
            <p>{hotel.location}</p>
            <p>评分: {hotel.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
});

export default HotelList;
