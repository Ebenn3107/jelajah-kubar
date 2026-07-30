<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    protected $fillable = [
        'nama_kategori',
        'slug',
        'deskripsi',
    ];

    public function wisatas(): HasMany
    {
        return $this->hasMany(Wisata::class);
    }
}
