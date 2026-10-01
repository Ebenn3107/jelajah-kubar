import { Head, router, usePage } from '@inertiajs/react';
import { Compass, Download, Loader2, Save } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { PlanView } from '@/components/plan-view';
import { Button } from '@/components/ui/button';
import { downloadItinerary } from '@/lib/itinerary';
import type { Auth } from '@/types';
import type { PlanResult } from '@/types/plan';

interface Props {
    result: string | null;
    error: string | null;
    input?: { durasi: number; budget: string; minat: string } | null;
}

const fieldClass = 'w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 focus-visible:border-brand focus-visible:outline-2 focus-visible:outline-brand';

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

    return (
        <>
            <Head title="Perencana Perjalanan" />

            <div className="mx-auto max-w-7xl px-5 py-8 md:px-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">Perencana Perjalanan AI</h1>
                    <p className="mt-1 text-neutral-600">Susun itinerari perjalananmu ke Kutai Barat dengan bantuan AI</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Detail Perjalanan</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="durasi" className="mb-1 block text-sm font-medium text-neutral-700">Durasi (hari)</label>
                                    <input id="durasi" type="number" min={1} max={14} value={durasi} onChange={(e) => setDurasi(Number(e.target.value))} className={fieldClass} />
                                </div>
                                <div>
                                    <label htmlFor="budget" className="mb-1 block text-sm font-medium text-neutral-700">Anggaran</label>
                                    <input id="budget" type="text" maxLength={255} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Rp 500.000" required className={fieldClass} />
                                </div>
                                <div>
                                    <label htmlFor="minat" className="mb-1 block text-sm font-medium text-neutral-700">Minat</label>
                                    <textarea id="minat" maxLength={255} value={minat} rows={3} onChange={(e) => setMinat(e.target.value)} placeholder="Air terjun, budaya, hiking, fotografi..." className={fieldClass} />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full rounded-xl bg-brand py-6 text-base font-bold hover:bg-brand-hover disabled:opacity-50">
                                    {loading ? (
                                        <><Loader2 className="mr-2 size-5 animate-spin" /> Menyusun rencana...</>
                                    ) : (
                                        <><Compass className="mr-2 size-5" /> {auth.user ? 'Buat Rencana' : 'Masuk untuk Membuat Rencana'}</>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-8" aria-live="polite" aria-busy={loading}>
                        {loading ? (
                            <div className="animate-pulse space-y-4" role="status">
                                <span className="sr-only">AI sedang menyusun rencana perjalanan, ini bisa memakan waktu beberapa detik.</span>
                                <div className="h-20 rounded-2xl bg-neutral-200" />
                                <div className="h-48 rounded-2xl bg-neutral-200" />
                                <div className="h-48 rounded-2xl bg-neutral-100" />
                            </div>
                        ) : (
                            <>
                                {errorMessage && (
                                    <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{errorMessage}</div>
                                )}

                                {plan && !errorMessage && (
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-3">
                                            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]">
                                                <Download className="size-4" /> Unduh .txt
                                            </button>
                                            {auth.user && (
                                                <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-hover disabled:opacity-50 active:scale-[0.98]">
                                                    <Save className="size-4" /> {saving ? 'Menyimpan...' : 'Simpan Rencana'}
                                                </button>
                                            )}
                                        </div>
                                        <PlanView plan={plan} />
                                    </div>
                                )}

                                {!plan && !errorMessage && (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-24 text-center">
                                        <Compass className="size-16 text-neutral-300" aria-hidden="true" />
                                        <h3 className="mt-4 text-lg font-semibold text-neutral-600">Rencanakan Petualanganmu</h3>
                                        <p className="mt-1 max-w-md text-sm text-neutral-600">
                                            Isi durasi, anggaran, dan minatmu — AI akan menyusun itinerari yang sesuai.
                                        </p>
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
