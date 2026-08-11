import { Head, router } from '@inertiajs/react';
import { Brain, CheckCircle, Clock, Cpu, DollarSign, Power, XCircle } from 'lucide-react';
import { useState } from 'react';

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
    currentProvider: 'local' | 'deepseek' | 'auto';
    localEnabled: boolean;
}

const providerLabels: Record<string, string> = {
    local: 'Local LLM only',
    deepseek: 'DeepSeek API only',
    auto: 'Auto (Local → DeepSeek)',
};

export default function AdminAiLogs({ logs, summary, currentProvider, localEnabled }: Props) {
    const [provider, setProvider] = useState(currentProvider);
    const [localOn, setLocalOn] = useState(localEnabled);

    const handleSaveProvider = () => {
        router.post('/admin/ai-logs/provider', { provider }, { preserveScroll: true });
    };

    const handleToggleLocal = () => {
        const next = !localOn;
        setLocalOn(next);
        router.post('/admin/ai-logs/toggle-local', { enabled: next }, { preserveScroll: true });
    };

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

                {/* Provider Control Panel */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-sm shadow-black/20">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-100">
                            <Cpu className="size-4 text-teal-400" />
                            AI Provider Control
                        </h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${localOn ? 'bg-emerald-900/50 text-emerald-400' : 'bg-red-900/50 text-red-400'}`}>
                            Local LLM: {localOn ? 'ON' : 'OFF'}
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                        {/* Mode selector */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-zinc-400">Provider Mode</label>
                            <div className="grid gap-2 sm:grid-cols-3">
                                {(['local', 'deepseek', 'auto'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setProvider(mode)}
                                        className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                                            provider === mode
                                                ? 'border-teal-500 bg-teal-900/30 text-teal-300'
                                                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                                        }`}
                                    >
                                        <span className="mb-0.5 block text-[10px] uppercase tracking-wider opacity-60">
                                            {mode === 'local' ? '🤖' : mode === 'deepseek' ? '🖥️' : '🔄'} {mode}
                                        </span>
                                        <span className="font-medium">{providerLabels[mode]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle + Save */}
                        <div className="flex flex-col justify-end gap-3">
                            <button
                                onClick={handleToggleLocal}
                                className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                                    localOn
                                        ? 'border-red-700 text-red-400 hover:bg-red-900/20'
                                        : 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/20'
                                }`}
                            >
                                <Power className="size-4" />
                                {localOn ? 'Matikan Local LLM' : 'Aktifkan Local LLM'}
                            </button>
                            <button
                                onClick={handleSaveProvider}
                                className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                            >
                                Simpan Provider
                            </button>
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-zinc-500">
                        Mode aktif: <span className="text-zinc-300">{providerLabels[currentProvider]}</span>
                        {!localEnabled && ' — Local LLM dimatikan, semua request ke DeepSeek'}
                    </p>
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
