import { Head, Link, router } from '@inertiajs/react';
import { Bot, Loader2, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';
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

export default function LocalGuideIndex({ answer, question, relatedWisatas }: Props) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        setLoading(true);
        router.post('/local-guide', { question: input }, {
            onFinish: () => setLoading(false),
            preserveScroll: true,
        });
    };

    const suggestions = [
        'Apa saja wisata air terjun di Kutai Barat?',
        'Destinasi apa yang cocok untuk keluarga?',
        'Berapa harga tiket masuk Kersik Luway?',
        'Wisata budaya apa yang bisa dikunjungi?',
    ];

    return (
        <>
            <Head title="AI Local Guide" />

            <div className="mx-auto max-w-4xl px-5 py-8 md:px-[64px]">
                <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex rounded-full bg-[#00685f]/10 p-3">
                        <Bot className="size-8 text-[#00685f]" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900">AI Local Guide</h1>
                    <p className="mt-1 text-neutral-500">Ask anything about destinations in Kutai Barat</p>
                </div>

                {/* Chat Area */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    {question && answer && (
                        <div className="mb-6 space-y-4">
                            {/* Question */}
                            <div className="flex justify-end">
                                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-[#00685f] px-5 py-3 text-sm text-white">
                                    {question}
                                </div>
                            </div>
                            {/* Answer */}
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-2xl rounded-bl-sm border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm text-neutral-700">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#00685f]">
                                        <Sparkles className="size-3.5" /> AI Local Guide
                                    </div>
                                    <p className="leading-relaxed">{answer}</p>
                                    {relatedWisatas && relatedWisatas.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2 border-t border-neutral-200 pt-3">
                                            {relatedWisatas.map((w) => (
                                                <Link key={w.slug} href={`/wisata/${w.slug}`} className="rounded-full border border-[#00685f]/20 bg-white px-3 py-1 text-xs font-medium text-[#00685f] hover:bg-[#00685f]/5">
                                                    {w.nama}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {!question && !answer && (
                        <div className="flex flex-col items-center py-12">
                            <MessageSquare className="size-16 text-neutral-300" />
                            <h3 className="mt-4 text-lg font-semibold text-neutral-500">How can I help you?</h3>
                            <p className="mt-1 text-sm text-neutral-400">Ask any question about destinations, facilities, prices, or culture.</p>
                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => { setInput(s); }}
                                        className="rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-600 transition-colors hover:border-[#00685f]/30 hover:text-[#00685f]"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your question..."
                            className="flex-1 rounded-xl border border-neutral-300 px-5 py-3 text-sm focus:border-[#00685f] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="rounded-xl bg-[#00685f] px-6 py-3 hover:opacity-90 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                        </Button>
                    </form>
                </div>

                {question && answer && (
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => router.get('/local-guide')}
                            className="text-sm text-neutral-400 hover:text-[#00685f]"
                        >
                            Start new conversation
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

