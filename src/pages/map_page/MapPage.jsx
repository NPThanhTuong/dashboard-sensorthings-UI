/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './maps.css';

function MapPage() {
  const [mapType, setMapType] = useState('road');
  const [theme, setTheme] = useState('light');
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    // Mock sensor data (replace with actual API call)
    const sensorData = [
      { id: 1, type: 'humidity', name: 'Sensor độ ẩm', latitude: 10.030, longitude: 105.770, value: '50%', time: '' },
      { id: 2, type: 'light', name: 'Sensor ánh sáng', latitude: 10.031, longitude: 105.767, value: '80 Candela', time: '' },
      { id: 3, type: 'temperature', name: 'Sensor nhiệt độ', latitude: 10.028, longitude: 105.765, value: '25 độ C', time: '' }
    ];
    setSensors(sensorData);

    // Interval to update sensor time every second
    const intervalId = setInterval(() => {
      setSensors(prevSensors => (
        prevSensors.map(sensor => ({
          ...sensor,
          time: new Date().toLocaleTimeString()
        }))
      ));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMapTypeChange = (event) => {
    setMapType(event.target.value);
  };

  const addSensorToMap = (sensor) => {
    let infoText = '';
    switch (sensor.type) {
      case 'humidity':
        infoText = `Độ ẩm: ${sensor.value}`;
        break;
      case 'light':
        infoText = `Cường độ sáng: ${sensor.value}`;
        break;
      case 'temperature':
        infoText = `Nhiệt độ là: ${sensor.value}`;
        break;
      default:
        infoText = 'Thông tin không xác định';
    }

    return (
      <Marker key={sensor.id} position={[sensor.latitude, sensor.longitude]}>
        <Popup className="popup-content">
          <h3>{sensor.name}</h3>
          <p>{infoText}</p>
          <p>Thời gian: {sensor.time}</p>
        </Popup>
        <div className="marker" />
      </Marker>
    );
  };

  return (
    <div id="map-container" className={theme}>
      <div className="select-container">
        <div className="select-wrapper">
          <select value={mapType} onChange={handleMapTypeChange}>
            <option value="road">Mặc Định</option>
            <option value="satellite">Vệ Tinh</option>
          </select>
        </div>
      </div>
      <h1 className='h1'>BẢN ĐỒ VỊ TRÍ CÁC THIẾT BỊ CẢM BIẾN</h1>
      <MapContainer center={[10.03, 105.768]} zoom={15} style={{ height: '400px', width: '100%' }}>
        {mapType === 'road' ? (
          <TileLayer
            url={theme === 'light' ? 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png' : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'}
          />
        ) : (
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            attribution='&copy; Google Maps'
            maxZoom={20}
          />
        )}
        {sensors.map(sensor => addSensorToMap(sensor))}
      </MapContainer>
    </div>
  );
}

export default MapPage;
