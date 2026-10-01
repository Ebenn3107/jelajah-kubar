<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Wisata extends Model
{
    protected $fillable = [
        'nama_wisata',
        'slug',
        'alamat',
        'deskripsi',
        'foto',
        'kategori_id',
        'latitude',
        'longitude',
        'harga_tiket',
        'jam_buka',
        'jam_tutup',
        'kontak',
        'is_active',
        'review_summary',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_active' => 'boolean',
        ];
    }

    protected $appends = ['foto_url'];

    protected function fotoUrl(): Attribute
    {
        return Attribute::get(fn () => $this->foto
            ? (str_starts_with($this->foto, 'http') ? $this->foto : Storage::url($this->foto))
            : null);
    }

    protected static function booted(): void
    {
        // Slug tidak diregenerasi saat rename agar URL publik tidak putus
        static::creating(function (Wisata $wisata) {
            if (empty($wisata->slug)) {
                $base = Str::slug($wisata->nama_wisata) ?: 'wisata';
                $slug = $base;

                for ($i = 2; static::where('slug', $slug)->exists(); $i++) {
                    $slug = "{$base}-{$i}";
                }

                $wisata->slug = $slug;
            }
        });
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    public function galeris(): HasMany
    {
        return $this->hasMany(Galeri::class);
    }

    public function fasilitas(): BelongsToMany
    {
        return $this->belongsToMany(Fasilitas::class, 'fasilitas_wisata');
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'wisata_user_favorit');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
