import { Head, router, usePage } from '@inertiajs/react';
import { Compass, Download, Loader2, Save } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { PlanView } from '@/components/plan-view';
import { downloadItinerary } from '@/lib/itinerary';
import type { Auth } from '@/types';
import type { PlanResult } from '@/types/plan';

interface Props {
    result: string | null;
    error: string | null;
    input?: { durasi: number; budget: string; minat: string } | null;
}

const fieldClass = 'w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-outline focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15';

export default function TravelPlannerIndex({ result, error, input }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [durasi, setDurasi] = useState(input?.durasi || 2);
    const [budget, setBudget] = useState(input?.budget || '');
    const [minat, setMinat] = useState(input?.minat || '');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const { plan, parseFailed } = useMemo(() => {
        if (!result) {
            return { plan: null, parseFailed: false };
        }

        try {
            return { plan: JSON.parse(result) as PlanResult, parseFailed: false };
        } catch {
            return { plan: null, parseFailed: true };
        }
    }, [result]);

    const handleDownload = useCallback(() => {
        if (plan) {
            downloadItinerary(plan, { durasi, budget, minat }, `jelajah-kubar-rencana-${durasi}hari.txt`);
        }
    }, [plan, durasi, budget, minat]);

    const handleSave = useCallback(() => {
        if (!plan || !auth.user || saving) {
            return;
        }

        setSaving(true);
        router.post('/travel-planner/save', { durasi, budget, minat, result: JSON.stringify(plan) }, { onFinish: () => setSaving(false) });
    }, [plan, auth.user, durasi, budget, minat, saving]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!auth.user) {
            router.visit('/login');

            return;
        }

        setLoading(true);
        router.post('/travel-planner', { durasi, budget, minat }, { onFinish: () => setLoading(false) });
    };

    const errorMessage = error ?? (parseFailed ? 'Hasil rencana tidak dapat dibaca. Coba buat ulang.' : null);

    const steps = [
        { title: 'Isi detail', text: 'Durasi, anggaran, dan minat perjalananmu.' },
        { title: 'Asisten menyusun', text: 'Itinerari per hari dari data destinasi Jelajah Kubar.' },
        { title: 'Simpan atau unduh', text: 'Simpan ke akunmu atau unduh sebagai teks.' },
    ];

    return (
        <>
            <Head title="Perencana Perjalanan" />

            <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-16 md:pt-12">
                <PageHeader
                    eyebrow="Perencana Perjalanan"
                    title="Susun itinerari ke Kutai Barat"
                    description="Beri tahu berapa hari dan berapa anggaranmu. Asisten menyusun rencana per hari dari destinasi yang ada."
                />

                <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-surface-low p-6 md:p-8 lg:sticky lg:top-28">
                            <h2 className="text-xl font-bold tracking-tight text-ink">Detail perjalanan</h2>
                            <div>
                                <label htmlFor="durasi" className="mb-2 block text-sm font-semibold text-ink">Durasi (hari)</label>
                                <input id="durasi" type="number" min={1} max={14} value={durasi} onChange={(e) => setDurasi(Number(e.target.value))} className={fieldClass} />
                            </div>
                            <div>
                                <label htmlFor="budget" className="mb-2 block text-sm font-semibold text-ink">Anggaran</label>
                                <input id="budget" type="text" maxLength={255} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="mis. Rp 500.000" required className={fieldClass} />
                            </div>
                            <div>
                                <label htmlFor="minat" className="mb-2 block text-sm font-semibold text-ink">Minat <span className="font-normal text-ink-muted">(opsional)</span></label>
                                <textarea id="minat" maxLength={255} value={minat} rows={3} onChange={(e) => setMinat(e.target.value)} placeholder="Air terjun, budaya, fotografi" className={fieldClass} />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-4 py-3.5 whitespace-nowrap font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
                            >
                                {loading ? (
                                    <><Loader2 className="size-5 animate-spin" aria-hidden="true" /> Menyusun rencana...</>
                                ) : (
                                    <><Compass className="size-5" aria-hidden="true" /> {auth.user ? 'Buat rencana' : 'Masuk untuk membuat'}</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="min-w-0 lg:col-span-8" aria-live="polite" aria-busy={loading}>
                        {loading ? (
                            <div className="animate-pulse space-y-4" role="status">
                                <span className="sr-only">Asisten sedang menyusun rencana perjalanan, ini bisa memakan waktu beberapa detik.</span>
                                <div className="h-24 rounded-3xl bg-surface-high" />
                                <div className="h-48 rounded-3xl bg-surface-high" />
                                <div className="h-48 rounded-3xl bg-surface-low" />
                            </div>
                        ) : (
                            <>
                                {errorMessage && (
                                    <div role="alert" className="rounded-3xl bg-red-50 p-6 text-red-700">{errorMessage}</div>
                                )}

                                {plan && !errorMessage && (
                                    <div className="space-y-8">
                                        <div className="flex flex-wrap gap-3">
                                            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-brand px-6 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                                                <Download className="size-4" aria-hidden="true" /> Unduh .txt
                                            </button>
                                            {auth.user && (
                                                <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60">
                                                    <Save className="size-4" aria-hidden="true" /> {saving ? 'Menyimpan...' : 'Simpan rencana'}
                                                </button>
                                            )}
                                        </div>
                                        <PlanView plan={plan} />
                                    </div>
                                )}

                                {!plan && !errorMessage && (
                                    <div>
                                        <h2 className="mb-6 text-2xl font-bold tracking-tight text-ink">Begini caranya</h2>
                                        <ol className="space-y-6">
                                            {steps.map((step, i) => (
                                                <li key={step.title} className="flex gap-5">
                                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-soft text-base font-bold text-copper">{i + 1}</span>
                                                    <div>
                                                        <p className="text-lg font-semibold text-ink">{step.title}</p>
                                                        <p className="mt-1 leading-relaxed text-ink-muted">{step.text}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
