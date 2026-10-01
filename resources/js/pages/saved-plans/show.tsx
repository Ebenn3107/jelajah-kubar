import { Head, Link, router } from '@inertiajs/react';
import { Calendar, DollarSign, Download, Trash2 } from 'lucide-react';
import { PlanView } from '@/components/plan-view';
import { downloadItinerary } from '@/lib/itinerary';
import type { PlanResult } from '@/types/plan';

interface SavedPlanData {
    id: number;
    title: string;
    durasi: number;
    budget: string;
    minat: string | null;
    result: PlanResult | null;
    created_at: string;
}

export default function SavedPlansShow({ plan }: { plan: SavedPlanData }) {
    const result = plan.result;

    const handleDownload = () => {
        if (result) {
            downloadItinerary(result, plan, `jelajah-kubar-${plan.title?.toLowerCase().replace(/\s+/g, '-') || 'rencana'}.txt`);
        }
    };

    const handleDelete = () => {
        if (confirm('Hapus rencana perjalanan ini?')) {
            router.delete(`/saved-plans/${plan.id}`);
        }
    };

    return (
        <>
            <Head title={plan.title} />

            <div className="mx-auto max-w-7xl px-5 py-8 md:px-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link href="/saved-plans" className="text-sm text-brand hover:underline">← Rencana Saya</Link>
                        <h1 className="mt-1 text-2xl font-bold text-neutral-900">{plan.title}</h1>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                            <span className="flex items-center gap-1"><Calendar className="size-3.5" aria-hidden="true" /> {plan.durasi} hari</span>
                            <span className="flex items-center gap-1"><DollarSign className="size-3.5" aria-hidden="true" /> {plan.budget}</span>
                            {plan.minat && <span>Minat: {plan.minat}</span>}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {result && (
                            <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]">
                                <Download className="size-4" /> Unduh
                            </button>
                        )}
                        <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98]">
                            <Trash2 className="size-4" /> Hapus
                        </button>
                    </div>
                </div>

                {result ? (
                    <PlanView plan={result} />
                ) : (
                    <p className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">Isi rencana ini tidak tersedia.</p>
                )}
            </div>
        </>
    );
}
