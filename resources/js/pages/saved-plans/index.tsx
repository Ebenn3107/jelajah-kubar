import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Compass, DollarSign, Route, Trash2 } from 'lucide-react';

interface PlanItem {
    id: number;
    title: string;
    durasi: number;
    budget: string;
    minat: string | null;
    created_at: string;
}

interface Props {
    plans: PlanItem[];
}

export default function SavedPlansIndex({ plans }: Props) {
    const handleDelete = (id: number, title: string) => {
        if (confirm(`Hapus "${title}"?`)) {
            router.delete(`/saved-plans/${id}`);
        }
    };

    return (
        <>
            <Head title="My Plans" />

            <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-[64px]">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
                            <Route className="size-6 text-[#00685f]" />
                            My Plans
                        </h1>
                        <p className="mt-1 text-sm text-neutral-500">{plans.length} saved itineraries</p>
                    </div>
                    <Link href="/travel-planner" className="rounded-xl bg-[#00685f] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                        + New Plan
                    </Link>
                </div>

                {plans.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-20">
                        <Route className="size-16 text-neutral-300" />
                        <p className="text-lg font-medium text-neutral-500">No saved plans yet</p>
                        <p className="text-sm text-neutral-400">Generate a travel plan and save it here.</p>
                        <Link href="/travel-planner" className="mt-2 rounded-full bg-[#00685f] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90">
                            Create Travel Plan
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <div key={plan.id} className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                                <Link href={`/saved-plans/${plan.id}`} className="block">
                                    <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-[#00685f]">{plan.title}</h3>
                                    <div className="mt-3 flex flex-wrap gap-3 text-sm text-neutral-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="size-3.5" /> {plan.durasi} days
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="size-3.5" /> {plan.budget}
                                        </span>
                                    </div>
                                    {plan.minat && <p className="mt-2 line-clamp-1 text-xs text-neutral-400">{plan.minat}</p>}
                                    <p className="mt-3 text-xs text-neutral-400">Saved {plan.created_at}</p>
                                </Link>
                                <button
                                    onClick={() => handleDelete(plan.id, plan.title)}
                                    className="mt-3 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
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

