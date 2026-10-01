import { Head, Link, router } from '@inertiajs/react';
import { Bot, Loader2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

interface RelatedWisata {
    slug: string;
    nama: string;
}

interface Props {
    answer: string | null;
    question: string | null;
    relatedWisatas?: RelatedWisata[];
}

const suggestions = [
    'Apa saja wisata air terjun di Kutai Barat?',
    'Destinasi apa yang cocok untuk keluarga?',
    'Berapa harga tiket masuk Kersik Luway?',
    'Wisata budaya apa yang bisa dikunjungi?',
];

export default function LocalGuideIndex({ answer, question, relatedWisatas }: Props) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const ask = (text: string) => {
        if (!text.trim() || loading) {
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
            <Head title="Pemandu Lokal AI" />

            <div className="mx-auto max-w-4xl px-5 py-8 md:px-16">
                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex rounded-full bg-brand/10 p-3">
                        <Bot className="size-8 text-brand" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900">Pemandu Lokal AI</h1>
                    <p className="mt-1 text-neutral-600">Tanyakan apa saja tentang destinasi di Kutai Barat</p>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div aria-live="polite" aria-busy={loading}>
                        {question && answer && !loading && (
                            <div className="mb-6 space-y-4">
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-5 py-3 text-sm text-white">{question}</div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm text-neutral-700">
                                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-brand">
                                            <Sparkles className="size-3.5" aria-hidden="true" /> Pemandu Lokal AI
                                        </div>
                                        <p className="leading-relaxed">{answer}</p>
                                        {relatedWisatas && relatedWisatas.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-200 pt-3">
                                                {relatedWisatas.map((w) => (
                                                    <Link key={w.slug} href={`/wisata/${w.slug}`} className="rounded-full border border-brand/20 bg-white px-3 py-1 text-xs font-medium text-brand hover:bg-brand/5">
                                                        {w.nama}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="mb-6 flex justify-start" role="status">
                                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm text-neutral-600">
                                    <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Pemandu sedang mengetik...
                                </div>
                            </div>
                        )}

                        {!question && !answer && !loading && (
                            <div className="flex flex-col items-center py-12">
                                <MessageSquare className="size-16 text-neutral-300" aria-hidden="true" />
                                <h3 className="mt-4 text-lg font-semibold text-neutral-600">Ada yang bisa dibantu?</h3>
                                <p className="mt-1 text-sm text-neutral-600">Tanyakan tentang destinasi, fasilitas, harga, atau budaya.</p>
                                <div className="mt-6 flex flex-wrap justify-center gap-2">
                                    {suggestions.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => {
                                                setInput(s);
                                                ask(s);
                                            }}
                                            className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-600 transition-colors hover:border-brand/30 hover:text-brand"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <label htmlFor="pertanyaan" className="sr-only">Pertanyaan</label>
                        <input
                            id="pertanyaan"
                            ref={inputRef}
                            type="text"
                            value={input}
                            maxLength={500}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ketik pertanyaanmu (min. 5 karakter)..."
                            className="flex-1 rounded-xl border border-neutral-300 px-5 py-3 text-sm text-neutral-900 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-brand"
                            disabled={loading}
                        />
                        <Button type="submit" aria-label="Kirim pertanyaan" disabled={loading || input.trim().length < 5} className="rounded-xl bg-brand px-6 py-3 hover:bg-brand-hover disabled:opacity-50">
                            {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                        </Button>
                    </form>
                </div>

                {question && answer && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={() => router.get('/local-guide')}
                            className="text-sm text-neutral-600 hover:text-brand"
                        >
                            Mulai percakapan baru
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
