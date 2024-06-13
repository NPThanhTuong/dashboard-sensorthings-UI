import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { HomeOutlined, UserOutlined, BankOutlined, ShopOutlined } from '@ant-design/icons';
import 'tailwindcss/tailwind.css';

const properties = [
    {
        address: "Hội trường Rùa",
        description: "",
        name: "Sensor độ ẩm",
        type: "sensor",
        value: 5,
        unit: "%",
        position: {
            lat: 10.029488021836567,
            lng: 105.76929997378228,
        },
    },
    {
        address: "Ký túc xá B",
        description: "",
        name: "Sensor ánh sáng",
        type: "sensor",
        value: 4,
        unit: 'lux',
        position: {
            lat: 10.03018558118967,
            lng: 105.76449167948627,
        },
    },
    //10.03018558118967, 105.76449167948627
];

const MapPage = () => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: "AIzaSyA6lKc8__4ASPd9UEX5B4ICVHRsaoIQbVM",
            version: "weekly",
            libraries: ["maps", "marker"],
        });

        loader.load().then((google) => {
            const mapInstance = new google.maps.Map(mapRef.current, {
                center: { lat: 10.029947193958321, lng: 105.77063299885214 },
                zoom: 18,
                mapId: "4504f8b37365c3d0",
            });

            setMap(mapInstance);

            properties.forEach((property) => {
                const marker = new google.maps.Marker({
                    position: property.position,
                    map: mapInstance,
                    title: property.description,
                });

                marker.addListener("click", () => {
                    setSelectedProperty((prev) => (prev === property ? null : property));
                });
            });

            // Get user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userPos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setUserLocation(userPos);
                        new google.maps.Marker({
                            position: userPos,
                            map: mapInstance,
                            title: "Your Location",
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 7,
                                fillColor: '#4285F4',
                                fillOpacity: 1,
                                strokeWeight: 1,
                            },
                        });
                        mapInstance.setCenter(userPos);
                    },
                    () => {
                        console.error("Error getting user location");
                    }
                );
            }
        });
    }, []);

    const buildContent = (property) => (
        <div className="p-4 bg-white shadow-lg rounded-lg">
            <div className="flex items-center">
                <div className="text-2xl mr-4">
                    {property.type === 'home' && <HomeOutlined />}
                    {property.type === 'building' && <BankOutlined />}
                    {property.type === 'warehouse' && <UserOutlined />}
                    {property.type === 'store-alt' && <ShopOutlined />}
                </div>
                <div>
                    <div className="text-xl font-bold">{property.name}</div>
                    <div>{property.address}</div>
                </div>
            </div>
            <div className="mt-2">
                <div>Giá trị: {property.value}</div>
                {/* <div>Bathrooms: {property.bath}</div> */}
                <div>Đơn vị tính: {property.unit}</div>
            </div>
        </div>
    );

    return (
        <div className="relative w-full h-screen">
            <div ref={mapRef} className="w-full h-full" />
            {selectedProperty && (
                <div className="absolute bottom-0 left-0 p-4">
                    {buildContent(selectedProperty)}
                </div>
            )}
        </div>
    );
};

export default MapPage;
