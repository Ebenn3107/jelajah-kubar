import { Head } from '@inertiajs/react';
import { Brain, CheckCircle, Clock, DollarSign, XCircle } from 'lucide-react';

interface AiLogItem {
    id: number;
    type: string;
    model: string;
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    cost: number;
    response_time_ms: number;
    success: boolean;
    error_message: string | null;
    user: { id: number; name: string } | null;
    created_at: string;
}

interface PaginatedLogs {
    data: AiLogItem[];
}

interface Props {
    logs: PaginatedLogs;
    summary: {
        total_calls: number;
        successful: number;
        failed: number;
        total_tokens: number;
        total_cost: number;
        avg_response_ms: number;
    };
}

export default function AdminAiLogs({ logs, summary }: Props) {
    const statsCards = [
        { label: 'Total Calls', value: summary.total_calls, icon: Brain, color: 'text-teal-400 bg-teal-900/50' },
        { label: 'Successful', value: summary.successful, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-900/50' },
        { label: 'Failed', value: summary.failed, icon: XCircle, color: summary.failed > 0 ? 'text-red-400 bg-red-900/50' : 'text-zinc-400 bg-zinc-800' },
        { label: 'Total Tokens', value: summary.total_tokens.toLocaleString(), icon: Clock, color: 'text-blue-400 bg-blue-900/50' },
        { label: 'Avg Response', value: `${summary.avg_response_ms}ms`, icon: Clock, color: 'text-purple-400 bg-purple-900/50' },
        { label: 'Total Cost', value: `$${summary.total_cost}`, icon: DollarSign, color: 'text-amber-400 bg-amber-900/50' },
    ];

    return (
        <>
            <Head title="AI Logs" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-zinc-950 p-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Usage Logs</h1>
                    <p className="text-sm text-zinc-500">Monitor AI API usage, token consumption, and costs</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {statsCards.map((card) => (
                        <div key={card.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-sm shadow-black/20">
                            <div className={`mb-3 inline-flex rounded-lg p-2 ${card.color}`}>
                                <card.icon className="size-5" />
                            </div>
                            <p className="text-2xl font-bold text-zinc-100">{card.value}</p>
                            <p className="mt-0.5 text-xs text-zinc-500">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900 text-zinc-400">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Type</th>
                                <th className="px-4 py-3 font-semibold">User</th>
                                <th className="px-4 py-3 font-semibold">Tokens</th>
                                <th className="px-4 py-3 font-semibold">Cost</th>
                                <th className="px-4 py-3 font-semibold">Time</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-zinc-500">No AI calls yet.</td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="bg-zinc-950 hover:bg-zinc-900/50">
                                        <td className="px-4 py-3 text-zinc-100">
                                            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono">{log.type}</span>
                                        </td>
                                        <td className="px-4 py-3 text-zinc-400">{log.user?.name || '—'}</td>
                                        <td className="px-4 py-3 text-zinc-100 font-mono text-xs">{log.total_tokens.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-zinc-100 font-mono text-xs">${log.cost.toFixed(8)}</td>
                                        <td className="px-4 py-3 text-zinc-100 font-mono text-xs">{log.response_time_ms}ms</td>
                                        <td className="px-4 py-3">
                                            {log.success
                                                ? <span className="text-emerald-400 text-xs font-medium">OK</span>
                                                : <span className="text-red-400 text-xs font-medium" title={log.error_message || ''}>FAIL</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-zinc-500 text-xs">{log.created_at}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

AdminAiLogs.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'AI Logs', href: '/admin/ai-logs' },
    ],
};
