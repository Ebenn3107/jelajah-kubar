import { Clock, Wallet } from 'lucide-react';
import type { PlanResult } from '@/types/plan';

export function PlanView({ plan }: { plan: PlanResult }) {
    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4 rounded-3xl bg-amber-soft p-6">
                <Wallet className="size-8 shrink-0 text-copper" aria-hidden="true" />
                <div>
                    <p className="text-sm font-semibold text-brand-deep">Perkiraan total anggaran</p>
                    <p className="text-2xl font-bold tracking-tight text-brand-deep">{plan.total_budget_estimate}</p>
                </div>
            </div>

            <ol className="space-y-10">
                {plan.days?.map((day) => (
                    <li key={day.day} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[3rem_minmax(0,1fr)] md:gap-x-6">
                        <div className="flex flex-col items-center">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white md:size-12 md:text-base">{day.day}</div>
                            <div className="mt-2 w-px grow bg-line" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 pb-2">
                            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-copper">Hari {day.day}</p>
                                    <h3 className="text-xl font-bold tracking-tight text-ink wrap-anywhere">{day.title}</h3>
                                </div>
                                <span className="text-sm font-semibold text-ink-muted">{day.total_cost}</span>
                            </div>

                            <ul className="divide-y divide-line/60 rounded-3xl bg-surface-low px-5 py-1 md:px-6">
                                {day.activities?.map((act, i) => (
                                    <li key={i} className="py-4">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                            <p className="font-semibold text-ink wrap-anywhere">{act.place}</p>
                                            {act.estimated_cost && <span className="text-sm font-medium text-ink-muted sm:shrink-0">{act.estimated_cost}</span>}
                                        </div>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-brand">
                                            <Clock className="size-3.5" aria-hidden="true" />
                                            {act.time}
                                        </p>
                                        <p className="mt-2 leading-relaxed text-ink-muted">{act.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ol>

            {plan.tips && (
                <div className="rounded-3xl border border-line bg-white p-6">
                    <h3 className="mb-2 text-lg font-bold tracking-tight text-ink">Tips perjalanan</h3>
                    <p className="leading-relaxed text-ink-muted">{plan.tips}</p>
                </div>
            )}
        </div>
    );
}
