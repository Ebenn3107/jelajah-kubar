<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Galeri extends Model
{
    protected $fillable = [
        'wisata_id',
        'foto',
        'caption',
        'is_primary',
        'sort_order',
    ];

    protected $appends = ['foto_url'];

    public function getFotoUrlAttribute(): ?string
    {
        if (! $this->foto) {
            return null;
        }

        return str_starts_with($this->foto, 'http') ? $this->foto : Storage::url($this->foto);
    }

    /** @return BelongsTo<Wisata, $this> */
    public function wisata(): BelongsTo
    {
        return $this->belongsTo(Wisata::class);
    }
}
