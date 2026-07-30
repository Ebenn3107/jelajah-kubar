import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Compass, DollarSign, Download, Trash2 } from 'lucide-react';
import { useCallback } from 'react';

interface DayActivity {
    time: string;
    place: string;
    description: string;
    estimated_cost: string;
}

interface DayPlan {
    day: number;
    title: string;
    activities: DayActivity[];
    total_cost: string;
}

interface PlanResult {
    days: DayPlan[];
    total_budget_estimate: string;
    tips: string;
}

interface SavedPlanData {
    id: number;
    title: string;
    durasi: number;
    budget: string;
    minat: string | null;
    result: PlanResult;
    created_at: string;
}

interface Props {
    plan: SavedPlanData;
}

export default function SavedPlansShow({ plan }: Props) {
    const result = plan.result;

    const handleDownload = useCallback(() => {
        let text = '=== Jelajah Kubar - Travel Itinerary ===\n\n';
        text += `Duration: ${plan.durasi} days\n`;
        text += `Budget: ${plan.budget}\n`;
        if (plan.minat) text += `Interests: ${plan.minat}\n`;
        text += `\n${'='.repeat(40)}\n\n`;

        result.days?.forEach((day) => {
            text += `Day ${day.day} — ${day.title}\n`;
            text += `${'─'.repeat(30)}\n`;
            day.activities?.forEach((act) => {
                text += `  ${act.time} — ${act.place}\n`;
                text += `  ${act.description}\n`;
                if (act.estimated_cost) text += `  Cost: ${act.estimated_cost}\n`;
                text += '\n';
            });
            text += `  Total: ${day.total_cost}\n\n`;
        });

        text += `${'='.repeat(40)}\n`;
        text += `Estimated Total: ${result.total_budget_estimate}\n\n`;
        if (result.tips) text += `Tips: ${result.tips}\n`;

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jelajah-kubar-${plan.title?.toLowerCase().replace(/\s+/g, '-') || 'itinerary'}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }, [plan, result]);

    const handleDelete = () => {
        if (confirm('Hapus rencana perjalanan ini?')) {
            router.delete(`/saved-plans/${plan.id}`);
        }
    };

    return (
        <>
            <Head title={plan.title} />

            <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-[64px]">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <Link href="/saved-plans" className="text-sm text-[#00685f] hover:underline">← My Plans</Link>
                        <h1 className="mt-1 text-2xl font-bold text-neutral-900">{plan.title}</h1>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                            <span className="flex items-center gap-1"><Calendar className="size-3.5" /> {plan.durasi} days</span>
                            <span className="flex items-center gap-1"><DollarSign className="size-3.5" /> {plan.budget}</span>
                            {plan.minat && <span className="text-neutral-400">Interests: {plan.minat}</span>}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 active:scale-[0.98]">
                            <Download className="size-4" /> Download
                        </button>
                        <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98]">
                            <Trash2 className="size-4" /> Delete
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Budget Overview */}
                    <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                        <div className="flex items-center gap-3 text-teal-800">
                            <DollarSign className="size-6" />
                            <div>
                                <p className="text-sm font-semibold">Estimated Total Budget</p>
                                <p className="text-lg font-bold">{result.total_budget_estimate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Per Day */}
                    {result.days?.map((day) => (
                        <div key={day.day} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-full bg-[#00685f] text-sm font-bold text-white">{day.day}</div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-neutral-900">Day {day.day}</h3>
                                        <p className="text-sm text-[#00685f]">{day.title}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-neutral-600">{day.total_cost}</span>
                            </div>
                            <div className="space-y-3">
                                {day.activities?.map((act, i) => (
                                    <div key={i} className="flex gap-4 rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-neutral-900">{act.place}</p>
                                                {act.estimated_cost && <span className="text-xs font-medium text-neutral-500">{act.estimated_cost}</span>}
                                            </div>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                                <Clock className="size-3" /> {act.time}
                                            </div>
                                            <p className="mt-1 text-sm text-neutral-600">{act.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {result.tips && (
                        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-neutral-900">Travel Tips</h3>
                            <p className="text-sm leading-relaxed text-neutral-600">{result.tips}</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

