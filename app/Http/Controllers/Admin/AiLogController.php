<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiLogController extends Controller
{
    public function index(Request $request): Response
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

        return Inertia::render('admin/ai-logs/index', [
            'logs' => $logs,
            'summary' => $summary,
        ]);
    }
}
