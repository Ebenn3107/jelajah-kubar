import type { PlanMeta, PlanResult } from '@/types/plan';

export function formatItinerary(plan: PlanResult, meta: PlanMeta): string {
    let text = '=== Jelajah Kubar - Rencana Perjalanan ===\n\n';
    text += `Durasi: ${meta.durasi} hari\n`;
    text += `Anggaran: ${meta.budget}\n`;

    if (meta.minat) {
        text += `Minat: ${meta.minat}\n`;
    }

    text += `\n${'='.repeat(40)}\n\n`;

    plan.days?.forEach((day) => {
        text += `Hari ${day.day} — ${day.title}\n`;
        text += `${'─'.repeat(30)}\n`;
        day.activities?.forEach((act) => {
            text += `  ${act.time} — ${act.place}\n`;
            text += `  ${act.description}\n`;

            if (act.estimated_cost) {
                text += `  Biaya: ${act.estimated_cost}\n`;
            }

            text += '\n';
        });
        text += `  Total: ${day.total_cost}\n\n`;
    });

    text += `${'='.repeat(40)}\n`;
    text += `Perkiraan Total: ${plan.total_budget_estimate}\n\n`;

    if (plan.tips) {
        text += `Tips: ${plan.tips}\n`;
    }

    return text;
}

export function downloadItinerary(plan: PlanResult, meta: PlanMeta, filename: string): void {
    const blob = new Blob([formatItinerary(plan, meta)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
