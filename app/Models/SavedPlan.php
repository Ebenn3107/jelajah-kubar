<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedPlan extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'durasi',
        'budget',
        'minat',
        'result',
    ];

    protected function casts(): array
    {
        return [
            'result' => 'array',
            'durasi' => 'integer',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
