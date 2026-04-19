import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, MarkerClusterer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 25.041,
  lng: 121.536,
};

// 深色霓虹地圖樣式 (Neon Dark Style)
const mapStyles = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
  // --- 新增：隱藏所有 POI (興趣點) 以保持畫面純淨 ---
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  }
];

const BarMapContainer = ({ bars = [], savedBars = {}, isCheckingSaved = false, onMarkerClick }) => {
  const barsWithCoords = bars.filter(b => b.latitude && b.longitude);

  // 取得內嵌圖示的 SVG Data URI
  const getMarkerIcon = (typeName, isSaved) => {
    const color = isSaved ? '#FF385C' : '#A0FF1F'; // 收藏用紅/粉，預設霓虹綠
    const size = 24;
    
    // 根據類別選擇內容圖示 (Path)
    let iconPath = '';
    
    if (isSaved) {
      // 實心愛心圖示
      iconPath = '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white" transform="scale(0.5) translate(12, 12)"/>';
    } else if (typeName?.includes('餐酒')) {
      // 刀叉圖示
      iconPath = '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill="white" transform="scale(0.6) translate(8, 8)"/>';
    } else if (typeName?.includes('特色') || typeName?.includes('動漫')) {
      // 音符圖示
      iconPath = '<path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" fill="white" transform="scale(0.6) translate(7, 7)"/>';
    } else {
      // 預設：雞尾酒杯
      iconPath = '<path d="M21 5V3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7L5.66 5h12.69l-1.78 2H7.43z" fill="white" transform="scale(0.6) translate(8, 8)"/>';
    }

    const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${color}" stroke="white" stroke-width="0.3"/>
      ${iconPath}
    </svg>
    `;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(mapInstance) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback(mapInstance) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <div className="relative w-full h-screen">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <MarkerClusterer
          options={{
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
            gridSize: 60,
            minimumClusterSize: 2,
          }}
        >
          {(clusterer) =>
            barsWithCoords.map((bar) => {
              const barId = bar.id || bar.bar_id;
              const isSaved = !!savedBars[barId];
              
              // 如果還在檢查狀態，我們先不顯示標記，或者顯示為灰色 (這裡選擇等狀態確認後一次亮起)
              if (isCheckingSaved) return null;

              return (
                <Marker
                  key={`bar-marker-${barId}`}
                  position={{ lat: Number(bar.latitude), lng: Number(bar.longitude) }}
                  title={bar.bar_name}
                  clusterer={clusterer}
                  label={{
                    text: bar.bar_name,
                    color: isSaved ? '#FF385C' : '#A0FF1F',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    className: 'marker-label'
                  }}
                  onClick={() => {
                    onMarkerClick(bar);
                    if (map) {
                      const pos = { lat: Number(bar.latitude), lng: Number(bar.longitude) };
                      map.panTo(pos);
                      setTimeout(() => {
                        map.panBy(0, -150);
                      }, 100);
                    }
                  }}
                  icon={{
                    url: getMarkerIcon(bar.bar_type_name, isSaved),
                    scaledSize: typeof window !== 'undefined' ? new window.google.maps.Size(24, 24) : null,
                    anchor: typeof window !== 'undefined' ? new window.google.maps.Point(12, 24) : null,
                    labelOrigin: typeof window !== 'undefined' ? new window.google.maps.Point(12, -8) : null,
                  }}
                />
              );
            })
          }
        </MarkerClusterer>
      </GoogleMap>

      {/* 為標籤加入陰影效果以提升可讀性 */}
      <style jsx global>{`
        .marker-label {
          text-shadow: 
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
             0 0 8px rgba(0,0,0,0.8);
          transform: translateY(-5px);
          pointer-events: none;
        }
      `}</style>
    </div>
  ) : (
    <div className="flex items-center justify-center w-full h-screen bg-black text-neon-green">
      <div className="animate-pulse text-xl">正在喚醒地圖精靈...</div>
    </div>
  );
};

export default React.memo(BarMapContainer);
