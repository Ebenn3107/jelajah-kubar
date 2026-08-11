<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiLog;
use App\Services\AiProviderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiLogController extends Controller
{
    public function index(): Response
    {
        $logs = AiLog::with('user')
            ->latest()
            ->paginate(25)
            ->withQueryString();

        $summary = [
            'total_calls' => AiLog::count(),
            'successful' => AiLog::where('success', true)->count(),
            'failed' => AiLog::where('success', false)->count(),
            'total_tokens' => AiLog::sum('total_tokens'),
            'total_cost' => round(AiLog::sum('cost'), 6),
            'avg_response_ms' => round(AiLog::avg('response_time_ms') ?? 0),
        ];

        $providerService = app(AiProviderService::class);

        return Inertia::render('admin/ai-logs/index', [
            'logs' => $logs,
            'summary' => $summary,
            'currentProvider' => $providerService->getProvider(),
            'localEnabled' => $providerService->isLocalEnabled(),
        ]);
    }

    public function updateProvider(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'provider' => 'required|in:local,deepseek,auto',
        ]);

        app(AiProviderService::class)->setProvider($validated['provider']);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'AI provider diperbarui.']);

        return back();
    }

    public function toggleLocal(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        app(AiProviderService::class)->setLocalEnabled($validated['enabled']);

        Inertia::flash('toast', ['type' => 'success', 'message' => $validated['enabled'] ? 'Local LLM diaktifkan.' : 'Local LLM dimatikan.']);

        return back();
    }
}
