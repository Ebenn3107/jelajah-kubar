import { useEffect, useRef } from 'react';

interface WisataMapProps {
    latitude: number;
    longitude: number;
    nama: string;
    className?: string;
}

export function WisataMap({ latitude, longitude, nama, className }: WisataMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const instanceRef = useRef<{ remove: () => void } | null>(null);

    useEffect(() => {
        // Dynamic import — Leaflet hanya di-load di browser, bukan SSR
        let destroyed = false;

        Promise.all([
            import('leaflet'),
            import('leaflet/dist/images/marker-icon.png'),
            import('leaflet/dist/images/marker-icon-2x.png'),
            import('leaflet/dist/images/marker-shadow.png'),
        ]).then(([L, icon, icon2x, shadow]) => {
            if (destroyed || !mapRef.current || instanceRef.current) {
return;
}

            // Vite tidak men-resolve path ikon default Leaflet → arahkan ke asset hasil bundle
            delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconUrl: icon.default,
                iconRetinaUrl: icon2x.default,
                shadowUrl: shadow.default,
            });

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
        });

        return () => {
            destroyed = true;
            instanceRef.current?.remove();
            instanceRef.current = null;
        };
    }, [latitude, longitude, nama]);

    return (
        <div
            ref={mapRef}
            className={className ?? 'h-[400px] w-full rounded-2xl overflow-hidden border border-neutral-200/30 shadow-sm'}
            style={{ position: 'relative', zIndex: 0, isolation: 'isolate' }}
        />
    );
}
