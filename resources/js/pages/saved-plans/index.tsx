import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Route, Trash2, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/page-header';

interface PlanItem {
    id: number;
    title: string;
    durasi: number;
    budget: string;
    minat: string | null;
    created_at: string;
}

export default function SavedPlansIndex({ plans }: { plans: PlanItem[] }) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Hapus "${title}"?`)) {
            router.delete(`/saved-plans/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Rencana Saya" />

            <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 md:px-16 md:pt-12">
                <PageHeader
                    eyebrow="Rencana tersimpan"
                    title="Rencana Saya"
                    description={`${plans.length} itinerari tersimpan`}
                    actions={
                        <Link href="/travel-planner" className="inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                            Buat rencana baru
                        </Link>
                    }
                />

                {plans.length === 0 ? (
                    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
                        <Route className="mb-5 size-14 text-outline" aria-hidden="true" />
                        <h2 className="text-xl font-bold text-ink">Belum ada rencana tersimpan</h2>
                        <p className="mt-2 text-ink-muted">Buat rencana perjalanan, lalu simpan di sini agar bisa dibuka lagi kapan saja.</p>
                        <Link href="/travel-planner" className="mt-8 rounded-full bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover">
                            Buat rencana perjalanan
                        </Link>
                    </div>
                ) : (
                    <ul className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <li key={plan.id} className="group relative flex flex-col rounded-3xl bg-surface-low p-6 transition-colors hover:bg-surface-high">
                                <Link href={`/saved-plans/${plan.id}`} className="flex grow flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-copper">Disimpan {plan.created_at}</p>
                                    <h2 className="text-xl font-bold leading-snug tracking-tight text-ink wrap-anywhere group-hover:text-brand">{plan.title}</h2>
                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
                                        <span className="flex items-center gap-1.5"><Calendar className="size-4" aria-hidden="true" /> {plan.durasi} hari</span>
                                        <span className="flex items-center gap-1.5"><Wallet className="size-4" aria-hidden="true" /> {plan.budget}</span>
                                    </div>
                                    {plan.minat && <p className="mt-3 line-clamp-2 text-sm text-ink-muted">Minat: {plan.minat}</p>}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(plan.id, plan.title)}
                                    aria-label={`Hapus rencana ${plan.title}`}
                                    className="mt-4 self-start rounded-full p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-red-600"
                                >
                                    <Trash2 className="size-4" aria-hidden="true" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
}
