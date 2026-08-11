<?php

return [
    // local | deepseek | auto (local dulu, fallback deepseek)
    'provider' => env('AI_PROVIDER', 'local'),

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
