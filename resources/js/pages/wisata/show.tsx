import { Head } from '@inertiajs/react';
import { Clock, ImageIcon, MapPin, Phone, Star, Ticket } from 'lucide-react';
import { WisataMap } from '@/components/wisata-map';
import { WisataPlanCard } from '@/components/wisata-plan-card';

interface GaleriItem {
    id: number;
    foto: string;
    foto_url: string | null;
    caption: string | null;
    is_primary: boolean;
}

interface FasilitasItem {
    id: number;
    nama_fasilitas: string;
}

interface WisataDetail {
    id: number;
    nama_wisata: string;
    slug: string;
    alamat: string;
    deskripsi: string;
    foto: string | null;
    foto_url: string | null;
    kategori: { id: number; nama_kategori: string } | null;
    latitude: string | null;
    longitude: string | null;
    harga_tiket: string | null;
    jam_buka: string | null;
    jam_tutup: string | null;
    kontak: string | null;
    galeris: GaleriItem[];
    fasilitas: FasilitasItem[];
}

interface Props {
    wisata: WisataDetail;
}

export default function WisataShow({ wisata }: Props) {
    const primaryFoto = wisata.galeris?.find((g) => g.is_primary)?.foto_url || wisata.foto_url;
    const galeris = wisata.galeris || [];

    return (
        <>
            <Head title={wisata.nama_wisata} />

            {/* Hero Section */}
            <section className="relative h-[60vh] w-full overflow-hidden md:h-[80vh]">
                {primaryFoto ? (
                    <img src={primaryFoto} alt={wisata.nama_wisata} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00685f]/40 to-[#00685f]/10" />
                )}
                <div className="hero-gradient absolute inset-0" />

                <div className="absolute bottom-0 left-0 right-0 mx-auto flex max-w-[1280px] flex-col justify-end px-5 pb-16 md:px-[64px]">
                    <nav className="mb-2 flex items-center gap-2 text-sm text-white/80">
                        <a href="/wisata" className="hover:text-white">Destinations</a>
                        <span className="text-[14px]">›</span>
                        <span className="text-white">{wisata.nama_wisata}</span>
                    </nav>

                    <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
                        {wisata.nama_wisata}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <div className="flex items-center text-sm text-white/90">
                            <MapPin className="mr-1 size-4" />
                            {wisata.alamat}
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-[#00685f]/40 px-3 py-1 text-sm text-white backdrop-blur-md">
                            <Star className="size-4 fill-white" />
                            4.8 <span className="text-white/70">(120 Reviews)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 px-5 py-16 md:px-[64px] lg:grid-cols-12">
                <div className="lg:col-span-8">
                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold text-[#00685f]">About</h2>
                        <p className="text-lg leading-relaxed text-neutral-700">{wisata.deskripsi}</p>
                    </div>

                    {/* Info Grid */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        {wisata.jam_buka && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5">
                                <div className="mb-2 flex items-center gap-4 text-[#00685f]">
                                    <Clock className="size-5" />
                                    <span className="text-sm font-semibold">Opening Hours</span>
                                </div>
                                <p className="text-xl font-semibold text-neutral-900">{wisata.jam_buka}</p>
                                {wisata.jam_tutup && <p className="mt-1 text-xs text-neutral-500">Until {wisata.jam_tutup}</p>}
                            </div>
                        )}
                        {wisata.harga_tiket && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5">
                                <div className="mb-2 flex items-center gap-4 text-[#00685f]">
                                    <Ticket className="size-5" />
                                    <span className="text-sm font-semibold">Entrance Fee</span>
                                </div>
                                <p className="text-xl font-semibold text-neutral-900">{wisata.harga_tiket}</p>
                            </div>
                        )}
                        {wisata.kontak && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5">
                                <div className="mb-2 flex items-center gap-4 text-[#00685f]">
                                    <Phone className="size-5" />
                                    <span className="text-sm font-semibold">Contact</span>
                                </div>
                                <p className="text-lg font-semibold text-neutral-900">{wisata.kontak}</p>
                            </div>
                        )}
                        {wisata.fasilitas && wisata.fasilitas.length > 0 && (
                            <div className="rounded-xl border border-neutral-200/30 bg-[#eff4ff] p-6 transition-all hover:shadow-lg hover:shadow-[#00685f]/5 md:col-span-2">
                                <div className="mb-3 flex items-center gap-4 text-[#00685f]">
                                    <span className="text-sm font-semibold">Facilities</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {wisata.fasilitas.map((f) => (
                                        <span key={f.id} className="rounded-full border border-neutral-200/50 bg-white px-4 py-1.5 text-sm font-medium text-neutral-700 shadow-sm">
                                            {f.nama_fasilitas}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Galeri */}
                    {galeris.length > 0 && (
                        <div className="mb-8">
                            <h3 className="mb-4 text-xl font-semibold text-neutral-900">Gallery</h3>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                                {galeris.map((g) => (
                                    <div key={g.id} className="group aspect-square cursor-zoom-in overflow-hidden rounded-2xl">
                                        {g.foto_url ? (
                                            <img src={g.foto_url} alt={g.caption || ''} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00685f]/10 to-[#00685f]/5">
                                                <ImageIcon className="size-12 text-[#00685f]/20" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Map */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-xl font-semibold text-neutral-900">Location</h3>
                        {wisata.latitude && wisata.longitude ? (
                            <WisataMap latitude={Number(wisata.latitude)} longitude={Number(wisata.longitude)} nama={wisata.nama_wisata} />
                        ) : (
                            <div className="flex h-[400px] w-full items-center justify-center rounded-2xl border border-neutral-200/30 bg-[#d9e3f6] shadow-sm">
                                <div className="flex flex-col items-center gap-2 text-[#00685f]">
                                    <MapPin className="size-10" />
                                    <p className="text-sm font-medium text-neutral-600">Location not available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <div className="sticky top-24 flex flex-col gap-6">
                        <WisataPlanCard />
                    </div>
                </div>
            </section>

            <style>{`
                .hero-gradient {
                    background: linear-gradient(to top, rgba(18, 28, 42, 0.8) 0%, rgba(18, 28, 42, 0) 50%);
                }
            `}</style>
        </>
    );
}

WisataShow.layout = null;
