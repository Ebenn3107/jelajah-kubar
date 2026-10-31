<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'wisata_id',
        'user_id',
        'rating',
        'komentar',
        'anonim',
    ];

    protected function casts(): array
    {
        return ['anonim' => 'boolean'];
    }

    /** @return BelongsTo<Wisata, $this> */
    public function wisata(): BelongsTo
    {
        return $this->belongsTo(Wisata::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
