import { Head, Link, router } from '@inertiajs/react';
import { Calendar, DollarSign, Route, Trash2 } from 'lucide-react';

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

            <div className="mx-auto max-w-7xl px-5 py-8 md:px-16">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
                            <Route className="size-6 text-brand" aria-hidden="true" />
                            Rencana Saya
                        </h1>
                        <p className="mt-1 text-sm text-neutral-600">{plans.length} itinerari tersimpan</p>
                    </div>
                    <Link href="/travel-planner" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
                        + Rencana Baru
                    </Link>
                </div>

                {plans.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <Route className="size-16 text-neutral-300" aria-hidden="true" />
                        <p className="text-lg font-medium text-neutral-600">Belum ada rencana tersimpan</p>
                        <p className="text-sm text-neutral-600">Buat rencana perjalanan lalu simpan di sini.</p>
                        <Link href="/travel-planner" className="mt-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover">
                            Buat Rencana Perjalanan
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div key={plan.id} className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                                <Link href={`/saved-plans/${plan.id}`} className="block">
                                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-brand">{plan.title}</h3>
                                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-600">
                                        <span className="flex items-center gap-1"><Calendar className="size-3.5" aria-hidden="true" /> {plan.durasi} hari</span>
                                        <span className="flex items-center gap-1"><DollarSign className="size-3.5" aria-hidden="true" /> {plan.budget}</span>
                                    </div>
                                    {plan.minat && <p className="mt-2 line-clamp-1 text-xs text-neutral-600">{plan.minat}</p>}
                                    <p className="mt-3 text-xs text-neutral-600">Disimpan {plan.created_at}</p>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(plan.id, plan.title)}
                                    aria-label={`Hapus rencana ${plan.title}`}
                                    className="mt-3 rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
