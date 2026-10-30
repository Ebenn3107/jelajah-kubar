<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
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

    /** @return Attribute<string|null, never> */
    protected function fotoUrl(): Attribute
    {
        return Attribute::get(fn (): ?string => $this->foto
            ? (str_starts_with($this->foto, 'http') ? $this->foto : Storage::url($this->foto))
            : null);
    }

    /** @return BelongsTo<Wisata, $this> */
    public function wisata(): BelongsTo
    {
        return $this->belongsTo(Wisata::class);
    }
}
