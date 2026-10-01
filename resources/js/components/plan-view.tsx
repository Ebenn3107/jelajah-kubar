import { Clock, DollarSign } from 'lucide-react';
import type { PlanResult } from '@/types/plan';

export function PlanView({ plan }: { plan: PlanResult }) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex items-center gap-3 text-teal-800">
                    <DollarSign className="size-6" aria-hidden="true" />
                    <div>
                        <p className="text-sm font-semibold">Perkiraan Total Anggaran</p>
                        <p className="text-lg font-bold">{plan.total_budget_estimate}</p>
                    </div>
                </div>
            </div>

            {plan.days?.map((day) => (
                <div key={day.day} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">{day.day}</div>
                            <div>
                                <h3 className="text-lg font-semibold text-neutral-900">Hari {day.day}</h3>
                                <p className="text-sm text-brand">{day.title}</p>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-neutral-600">{day.total_cost}</span>
                    </div>

                    <div className="space-y-3">
                        {day.activities?.map((act, i) => (
                            <div key={i} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="font-semibold text-neutral-900">{act.place}</p>
                                    {act.estimated_cost && <span className="text-xs font-medium text-neutral-500">{act.estimated_cost}</span>}
                                </div>
                                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                                    <Clock className="size-3" aria-hidden="true" />
                                    {act.time}
                                </div>
                                <p className="mt-1 text-sm text-neutral-600">{act.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {plan.tips && (
                <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-neutral-900">Tips Perjalanan</h3>
                    <p className="text-sm leading-relaxed text-neutral-600">{plan.tips}</p>
                </div>
            )}
        </div>
    );
}
