import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface WisataMapProps {
    latitude: number;
    longitude: number;
    nama: string;
    className?: string;
}

export function WisataMap({ latitude, longitude, nama, className }: WisataMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapRef.current && !instanceRef.current) {
            const map = L.map(mapRef.current, {
                center: [latitude, longitude],
                zoom: 14,
                scrollWheelZoom: false,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(nama);

            instanceRef.current = map;

            // Enable scroll on click/focus
            map.on('click', () => {
                if (map.scrollWheelZoom) {
                    map.scrollWheelZoom.enable();
                }
            });

            map.on('mouseout', () => {
                if (map.scrollWheelZoom) {
                    map.scrollWheelZoom.disable();
                }
            });
        }

        return () => {
            instanceRef.current?.remove();
            instanceRef.current = null;
        };
    }, [latitude, longitude, nama]);

    return (
        <div
            ref={mapRef}
            className={className ?? 'h-[400px] w-full rounded-2xl overflow-hidden border border-neutral-200/30 shadow-sm'}
        />
    );
}
