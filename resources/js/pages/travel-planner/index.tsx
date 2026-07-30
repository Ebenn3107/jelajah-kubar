import { Head, router, usePage } from '@inertiajs/react';
import { Clock, Compass, DollarSign, Download, Loader2, Save } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Auth } from '@/types';

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

interface Props {
    result: string | null;
    error: string | null;
    input?: { durasi: number; budget: string; minat: string } | null;
}

export default function TravelPlannerIndex({ result, error, input }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [durasi, setDurasi] = useState(input?.durasi || 2);
    const [budget, setBudget] = useState(input?.budget || '');
    const [minat, setMinat] = useState(input?.minat || '');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    let plan: PlanResult | null = null;
    try {
        if (result) plan = JSON.parse(result);
    } catch { /* invalid JSON */ }

    const formatItineraryText = useCallback((p: PlanResult): string => {
        let text = '=== Jelajah Kubar - Travel Itinerary ===\n\n';
        text += `Duration: ${input?.durasi || ''} days\n`;
        text += `Budget: ${input?.budget || ''}\n`;
        if (input?.minat) text += `Interests: ${input.minat}\n`;
        text += `\n${'='.repeat(40)}\n\n`;

        p.days?.forEach((day) => {
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
        text += `Estimated Total: ${p.total_budget_estimate}\n\n`;
        if (p.tips) text += `Tips: ${p.tips}\n`;

        return text;
    }, [input]);

    const handleDownload = useCallback(() => {
        if (!plan) return;
        const text = formatItineraryText(plan);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `jelajah-kubar-itinerary-${durasi}day.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }, [plan, formatItineraryText, durasi]);

    const handleSave = useCallback(() => {
        if (!plan || !auth.user || saving) return;
        setSaving(true);
        router.post('/travel-planner/save', {
            durasi,
            budget,
            minat,
            result: JSON.stringify(plan),
        }, {
            onFinish: () => setSaving(false),
        });
    }, [plan, auth.user, durasi, budget, minat, saving]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user) { router.visit('/login'); return; }
        setLoading(true);
        router.post('/travel-planner', { durasi, budget, minat }, {
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false),
        });
    };

    return (
        <>
            <Head title="Travel Planner" />

            <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-[64px]">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-neutral-900">AI Travel Planner</h1>
                    <p className="mt-1 text-neutral-500">Plan your trip to Kutai Barat with AI-powered itinerary</p>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Form */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-lg font-semibold text-neutral-900">Trip Details</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700">Duration (days)</label>
                                    <input
                                        type="number" min={1} max={14} value={durasi}
                                        onChange={(e) => setDurasi(Number(e.target.value))}
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#00685f] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700">Budget</label>
                                    <input
                                        type="text" value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        placeholder="Rp 500.000"
                                        required
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#00685f] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-neutral-700">Interests</label>
                                    <textarea
                                        value={minat} rows={3}
                                        onChange={(e) => setMinat(e.target.value)}
                                        placeholder="Waterfalls, culture, hiking, photography..."
                                        className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:border-[#00685f] focus:outline-none focus:ring-1 focus:ring-[#00685f]"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading || !auth.user}
                                    className="w-full rounded-xl bg-[#00685f] py-6 text-base font-bold hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <><Loader2 className="mr-2 size-5 animate-spin" /> Generating...</>
                                    ) : (
                                        <><Compass className="mr-2 size-5" /> Generate Plan</>
                                    )}
                                </Button>
                                {!auth.user && (
                                    <p className="text-center text-xs text-neutral-500">Login to use Travel Planner.</p>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-8">
                        {error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
                        )}

                        {plan && !error && (
                            <div className="space-y-6">
                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]">
                                        <Download className="size-4" /> Download .txt
                                    </button>
                                    {auth.user && (
                                        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#00685f] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 active:scale-[0.98]">
                                            <Save className="size-4" /> {saving ? 'Saving...' : 'Save Plan'}
                                        </button>
                                    )}
                                </div>

                                {/* Budget Overview */}
                                <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                                    <div className="flex items-center gap-3 text-teal-800">
                                        <DollarSign className="size-6" />
                                        <div>
                                            <p className="text-sm font-semibold">Estimated Total Budget</p>
                                            <p className="text-lg font-bold">{plan.total_budget_estimate}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Per Day */}
                                {plan.days?.map((day) => (
                                    <div key={day.day} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-full bg-[#00685f] text-sm font-bold text-white">
                                                    {day.day}
                                                </div>
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
                                                    <div className="flex items-start gap-3 text-[#00685f]">
                                                        <Clock className="mt-0.5 size-4 shrink-0" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <p className="font-semibold text-neutral-900">{act.place}</p>
                                                            {act.estimated_cost && (
                                                                <span className="text-xs font-medium text-neutral-500">{act.estimated_cost}</span>
                                                            )}
                                                        </div>
                                                        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                                            <Clock className="size-3" />
                                                            {act.time}
                                                        </div>
                                                        <p className="mt-1 text-sm text-neutral-600">{act.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Tips */}
                                {plan.tips && (
                                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                                        <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-neutral-900">
                                            Travel Tips
                                        </h3>
                                        <p className="text-sm leading-relaxed text-neutral-600">{plan.tips}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!plan && !error && (
                            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 py-24 text-center">
                                <Compass className="size-16 text-neutral-300" />
                                <h3 className="mt-4 text-lg font-semibold text-neutral-500">Plan Your Adventure</h3>
                                <p className="mt-1 max-w-md text-sm text-neutral-400">
                                    Tell us your duration, budget, and interests — we'll create a personalized itinerary using AI.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

