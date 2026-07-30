<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Fasilitas extends Model
{
    protected $fillable = [
        'nama_fasilitas',
        'ikon',
    ];

    public function wisatas(): BelongsToMany
    {
        return $this->belongsToMany(Wisata::class, 'fasilitas_wisata');
    }
}
