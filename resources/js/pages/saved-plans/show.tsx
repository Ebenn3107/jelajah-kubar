import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Download, Trash2, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
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

            <div className="mx-auto max-w-4xl px-5 pb-20 pt-8 md:px-16 md:pt-12">
                <Link href="/saved-plans" className="mb-6 inline-block text-sm font-semibold text-brand hover:text-brand-hover">← Rencana Saya</Link>

                <PageHeader
                    eyebrow="Rencana perjalanan"
                    title={plan.title}
                    description={
                        <span className="flex flex-wrap items-center gap-x-5 gap-y-1 text-base">
                            <span className="flex items-center gap-1.5"><Calendar className="size-4" aria-hidden="true" /> {plan.durasi} hari</span>
                            <span className="flex items-center gap-1.5"><Wallet className="size-4" aria-hidden="true" /> {plan.budget}</span>
                            {plan.minat && <span>Minat: {plan.minat}</span>}
                        </span>
                    }
                    actions={
                        <>
                            {result && (
                                <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-full border border-brand px-6 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                                    <Download className="size-4" aria-hidden="true" /> Unduh
                                </button>
                            )}
                            <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-full border border-red-200 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                <Trash2 className="size-4" aria-hidden="true" /> Hapus
                            </button>
                        </>
                    }
                />

                {result ? (
                    <PlanView plan={result} />
                ) : (
                    <p className="rounded-3xl bg-surface-low p-6 text-ink-muted">Isi rencana ini tidak tersedia.</p>
                )}
            </div>
        </>
    );
}
