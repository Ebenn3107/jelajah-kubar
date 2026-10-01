import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowUpRight, Loader2, Send, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import type { Auth } from '@/types';

interface RelatedWisata {
    slug: string;
    nama: string;
}

interface Props {
    answer: string | null;
    question: string | null;
    relatedWisatas?: RelatedWisata[];
    quota?: { remaining: number; limit: number } | null;
}

const suggestions = [
    'Apa saja wisata air terjun di Kutai Barat?',
    'Destinasi apa yang cocok untuk keluarga?',
    'Berapa harga tiket masuk Kersik Luway?',
    'Wisata budaya apa yang bisa dikunjungi?',
];

export default function LocalGuideIndex({ answer, question, relatedWisatas, quota }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const ask = (text: string) => {
        if (!text.trim() || loading) {
            return;
        }

        if (!auth.user) {
            router.visit('/login');

            return;
        }

        setLoading(true);
        router.post('/local-guide', { question: text }, {
            preserveScroll: true,
            onSuccess: () => setInput(''),
            onFinish: () => setLoading(false),
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        ask(input);
    };

    return (
        <>
            <Head title="Pemandu Lokal" />

            <div className="mx-auto max-w-4xl px-5 pb-20 pt-8 md:px-16 md:pt-12">
                <PageHeader
                    eyebrow="Pemandu Lokal"
                    title="Tanya apa saja soal Kutai Barat"
                    description="Harga tiket, fasilitas, atau tempat yang cocok untuk keluarga. Jawabannya diambil dari data destinasi Jelajah Kubar."
                />

                <div aria-live="polite" aria-busy={loading} className="min-h-40">
                    {question && answer && !loading && (
                        <div className="mb-8 space-y-5">
                            <div className="flex justify-end">
                                <p className="max-w-[85%] rounded-3xl rounded-br-md bg-brand px-5 py-3 text-white wrap-anywhere">{question}</p>
                            </div>
                            <div className="flex justify-start">
                                <div className="max-w-[92%] rounded-3xl rounded-bl-md bg-surface-low px-6 py-5 text-ink">
                                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-copper">
                                        <Sparkles className="size-3.5" aria-hidden="true" /> Pemandu Lokal
                                    </p>
                                    <p className="whitespace-pre-line leading-relaxed text-ink-muted">{answer}</p>
                                    {relatedWisatas && relatedWisatas.length > 0 && (
                                        <div className="mt-4 flex flex-wrap gap-2 border-t border-line/60 pt-4">
                                            {relatedWisatas.map((w) => (
                                                <Link key={w.slug} href={`/wisata/${w.slug}`} className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-brand">
                                                    {w.nama} <ArrowUpRight className="size-3.5" aria-hidden="true" />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && (
                        <div className="mb-8 flex justify-start" role="status">
                            <div className="flex items-center gap-2 rounded-3xl rounded-bl-md bg-surface-low px-6 py-4 text-ink-muted">
                                <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Pemandu sedang menjawab...
                            </div>
                        </div>
                    )}

                    {!question && !answer && !loading && (
                        <div className="mb-8">
                            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-copper">Coba tanyakan</p>
                            <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
                                {suggestions.map((s) => (
                                    <li key={s}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInput(s);
                                                ask(s);
                                            }}
                                            className="flex h-full w-full items-center justify-between gap-3 rounded-2xl bg-surface-low px-5 py-4 text-left font-medium text-ink transition-colors hover:bg-surface-high focus-visible:outline-2 focus-visible:outline-brand"
                                        >
                                            {s}
                                            <ArrowUpRight className="size-4 shrink-0 text-brand" aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="flex items-center rounded-full border border-line bg-white p-1.5 shadow-[0_10px_30px_rgba(18,28,42,0.08)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15">
                    <label htmlFor="pertanyaan" className="sr-only">Pertanyaan</label>
                    <input
                        id="pertanyaan"
                        ref={inputRef}
                        type="text"
                        value={input}
                        maxLength={500}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ketik pertanyaanmu (min. 5 karakter)"
                        className="min-w-0 grow border-none bg-transparent px-5 py-3 text-base text-ink placeholder:text-outline focus:outline-none"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        aria-label="Kirim pertanyaan"
                        disabled={loading || input.trim().length < 5}
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Send className="size-5" aria-hidden="true" />}
                    </button>
                </form>

                {auth.user && quota && (
                    <p className="mt-4 text-center text-sm text-ink-muted">
                        Sisa <strong className="font-semibold text-ink">{quota.remaining}</strong> dari {quota.limit} pertanyaan hari ini. Pertanyaan yang pernah ditanyakan tidak memakai jatah.
                    </p>
                )}

                {!auth.user && (
                    <p className="mt-4 text-center text-sm text-ink-muted">
                        <Link href="/login" className="font-semibold text-brand hover:underline">Masuk</Link> untuk bertanya. Pemakaian AI dibatasi kuota harian per akun.
                    </p>
                )}

                {question && answer && (
                    <div className="mt-6 text-center">
                        <button type="button" onClick={() => router.get('/local-guide')} className="text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-brand">
                            Mulai percakapan baru
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
