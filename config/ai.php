<?php

return [
    // deepseek | local | auto (local dulu, fallback deepseek). Ollama hanya opsi; produksi memakai deepseek.
    'provider' => env('AI_PROVIDER', 'deepseek'),

    // Batas pemakaian fitur AI untuk pengguna. Jawaban dari cache tidak dihitung.
    'limits' => [
        'travel_planner_per_day' => (int) env('AI_LIMIT_PLANNER_PER_DAY', 3),
        'local_guide_per_day' => (int) env('AI_LIMIT_GUIDE_PER_DAY', 15),
        // Pagar anggaran global (USD/hari). Terlampaui = fitur AI berhenti sampai besok.
        'daily_budget_usd' => (float) env('AI_DAILY_BUDGET_USD', 1.0),
    ],

    // Lama cache jawaban identik (hari)
    'cache_days' => [
        'local_guide' => (int) env('AI_CACHE_GUIDE_DAYS', 7),
        'travel_planner' => (int) env('AI_CACHE_PLANNER_DAYS', 1),
    ],

    'deepseek' => [
        'api_key' => env('DEEPSEEK_API_KEY'),
        'model' => env('DEEPSEEK_MODEL', 'deepseek-chat'),
        'max_tokens' => 2000,
        'temperature' => 0.7,
    ],

    'ollama' => [
        'base_url' => env('OLLAMA_BASE_URL', 'http://localhost:11434'),
        'model' => env('OLLAMA_MODEL', 'qwen2.5:1.5b'),
        'temperature' => 0.7,
    ],
];
