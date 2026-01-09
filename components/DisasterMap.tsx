
import React, { useEffect, useRef } from 'react';
import { DisasterRecord, Severity } from '../types';
import { SEVERITY_COLORS } from '../constants';

interface DisasterMapProps {
  records: DisasterRecord[];
  onSelectRecord: (record: DisasterRecord) => void;
  userLocation: [number, number] | null;
}

declare const L: any;

const DisasterMap: React.FC<DisasterMapProps> = ({ records, onSelectRecord, userLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Default center (San Francisco) if location not provided yet
    const initialCenter = userLocation || [37.7749, -122.4194];
    
    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: true
    }).setView(initialCenter, userLocation ? 10 : 3);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    // Add a vignette effect layer for aesthetics
    const vignette = document.createElement('div');
    vignette.className = 'leaflet-vignette';
    mapContainerRef.current.appendChild(vignette);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update center when user location changes
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.flyTo(userLocation, 10, {
        animate: true,
        duration: 1.5
      });

      // Add User Location Marker
      const userIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div class="relative flex items-center justify-center w-6 h-6">
            <div class="absolute w-full h-full bg-blue-500 rounded-full animate-ping opacity-75"></div>
            <div class="relative w-3 h-3 bg-blue-400 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current);
    }
  }, [userLocation]);

  // Update Markers when records change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    records.forEach(record => {
      const isCritical = record.severity === Severity.CRITICAL;
      const colorClass = SEVERITY_COLORS[record.severity];
      
      // Determine icon based on record type
      // We manually build the HTML to ensure it matches DISASTER_ICONS in looks
      const iconHtml = `
        <div class="group relative cursor-pointer">
          <div class="
            w-10 h-10 rounded-full flex items-center justify-center 
            bg-white/10 backdrop-blur-md border border-white/30
            hover:scale-125 transition-all duration-300 shadow-xl
            ${isCritical ? 'animate-pulse ring-4 ring-red-500/30' : ''}
          ">
            <span class="text-xl ${colorClass}">
              ${getIconHtml(record.type)}
            </span>
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(record.coordinates, { icon: markerIcon })
        .addTo(mapRef.current)
        .on('click', () => {
          onSelectRecord(record);
          mapRef.current.flyTo(record.coordinates, 8);
        });

      markersRef.current.push(marker);
    });
  }, [records, onSelectRecord]);

  return (
    <div className="relative w-full h-[600px] liquid-glass rounded-3xl overflow-hidden border border-white/10 shadow-inner z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-xl text-xs space-y-2 pointer-events-none z-[1001]">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_red]"></div>
           <span className="opacity-80">Critical Risk</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_orange]"></div>
           <span className="opacity-80">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_yellow]"></div>
           <span className="opacity-80">Moderate Risk</span>
        </div>
      </div>
    </div>
  );
};

// Helper to match the fa-icons used in constants
function getIconHtml(type: string): string {
  switch (type) {
    case 'Earthquake': return '<i class="fa-solid fa-house-crack"></i>';
    case 'Flood': return '<i class="fa-solid fa-house-flood-water"></i>';
    case 'Wildfire': return '<i class="fa-solid fa-fire"></i>';
    case 'Hurricane': return '<i class="fa-solid fa-tornado"></i>';
    case 'Tornado': return '<i class="fa-solid fa-wind"></i>';
    case 'Volcano': return '<i class="fa-solid fa-volcano"></i>';
    case 'Tsunami': return '<i class="fa-solid fa-water"></i>';
    default: return '<i class="fa-solid fa-triangle-exclamation"></i>';
  }
}

export default DisasterMap;
