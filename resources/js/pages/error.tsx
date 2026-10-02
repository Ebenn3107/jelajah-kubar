import { Head, Link } from '@inertiajs/react';
import { NatureIllustration } from '@/components/nature-illustration';

const messages: Record<number, { title: string; description: string }> = {
    403: {
        title: 'Area ini tidak bisa dimasuki',
        description: 'Akun Anda tidak punya izin untuk membuka halaman ini. Kembali ke jalur utama, ya.',
    },
    404: {
        title: 'Jalur ini tidak ditemukan',
        description: 'Halaman yang Anda cari mungkin sudah dipindahkan atau alamatnya salah ketik. Mari kembali ke jalur wisata.',
    },
    419: {
        title: 'Sesi Anda sudah berakhir',
        description: 'Halaman terlalu lama terbuka. Muat ulang halaman lalu coba lagi.',
    },
    429: {
        title: 'Terlalu banyak permintaan',
        description: 'Tunggu sebentar sebelum mencoba lagi. Kami menjaga agar situs tetap lancar untuk semua pengunjung.',
    },
    500: {
        title: 'Ada gangguan di sisi kami',
        description: 'Terjadi kesalahan di server. Tim kami sudah mendapat catatannya. Coba lagi beberapa saat lagi.',
    },
    503: {
        title: 'Sedang dalam perawatan',
        description: 'Kami sedang merapikan jalur. Silakan kembali sebentar lagi.',
    },
};

export default function ErrorPage({ status }: { status: number }) {
    const { title, description } = messages[status] ?? messages[500];

    return (
        <>
            <Head title={title} />

            <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-24 pt-10 text-center md:pt-16">
                <NatureIllustration className="w-full max-w-xl" />

                <p className="mt-10 text-sm font-semibold tracking-widest text-copper uppercase">Kesalahan {status}</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink md:text-5xl">{title}</h1>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-muted">{description}</p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {status === 419 ? (
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                            Muat ulang halaman
                        </button>
                    ) : (
                        <Link
                            href="/"
                            className="rounded-full bg-brand px-7 py-3 font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                        >
                            Kembali ke beranda
                        </Link>
                    )}
                    <Link
                        href="/wisata"
                        className="rounded-full border border-line bg-white px-7 py-3 font-semibold text-ink transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                    >
                        Jelajahi destinasi
                    </Link>
                </div>
            </div>
        </>
    );
}
