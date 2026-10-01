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
        { label: 'Total Calls', value: summary.total_calls, icon: Brain, color: 'text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/50' },
        { label: 'Successful', value: summary.successful, icon: CheckCircle, color: 'text-emerald-400 bg-emerald-900/50' },
        { label: 'Failed', value: summary.failed, icon: XCircle, color: summary.failed > 0 ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50' : 'text-muted-foreground bg-muted' },
        { label: 'Total Tokens', value: summary.total_tokens.toLocaleString(), icon: Clock, color: 'text-blue-400 bg-blue-900/50' },
        { label: 'Avg Response', value: `${summary.avg_response_ms}ms`, icon: Clock, color: 'text-purple-400 bg-purple-900/50' },
        { label: 'Total Cost', value: `$${summary.total_cost}`, icon: DollarSign, color: 'text-amber-400 bg-amber-900/50' },
    ];

    return (
        <>
            <Head title="AI Logs" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-background p-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">AI Usage Logs</h1>
                    <p className="text-sm text-muted-foreground">Monitor AI API usage, token consumption, and costs</p>
                </div>

                {/* Provider Control Panel */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm shadow-black/20">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                            <Cpu className="size-4 text-teal-600 dark:text-teal-400" />
                            AI Provider Control
                        </h2>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${localOn ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'}`}>
                            Local LLM: {localOn ? 'ON' : 'OFF'}
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                        {/* Mode selector */}
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Provider Mode</label>
                            <div className="grid gap-2 sm:grid-cols-3">
                                {(['local', 'deepseek', 'auto'] as const).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setProvider(mode)}
                                        className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                                            provider === mode
                                                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                                : 'border-input text-muted-foreground hover:border-ring'
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
                                        ? 'border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
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

                    <p className="mt-3 text-xs text-muted-foreground">
                        Mode aktif: <span className="text-foreground/80">{providerLabels[currentProvider]}</span>
                        {!localEnabled && ' — Local LLM dimatikan, semua request ke DeepSeek'}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {statsCards.map((card) => (
                        <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/20">
                            <div className={`mb-3 inline-flex rounded-lg p-2 ${card.color}`}>
                                <card.icon className="size-5" />
                            </div>
                            <p className="text-2xl font-bold text-foreground">{card.value}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-card text-muted-foreground">
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
                        <tbody className="divide-y divide-border">
                            {logs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No AI calls yet.</td>
                                </tr>
                            ) : (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="bg-background hover:bg-muted/50">
                                        <td className="px-4 py-3 text-foreground">
                                            <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono">{log.type}</span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{log.user?.name || '—'}</td>
                                        <td className="px-4 py-3 text-foreground font-mono text-xs">{log.total_tokens.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-foreground font-mono text-xs">${log.cost.toFixed(8)}</td>
                                        <td className="px-4 py-3 text-foreground font-mono text-xs">{log.response_time_ms}ms</td>
                                        <td className="px-4 py-3">
                                            {log.success
                                                ? <span className="text-emerald-400 text-xs font-medium">OK</span>
                                                : <span className="text-red-600 dark:text-red-400 text-xs font-medium" title={log.error_message || ''}>FAIL</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground text-xs">{log.created_at}</td>
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
