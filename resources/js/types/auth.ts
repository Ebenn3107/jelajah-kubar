export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

/* @chisel-passkeys */
export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};
/* @end-chisel-passkeys */

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};

export type Wisata = {
    id: number;
    nama_wisata: string;
    slug: string;
    alamat: string;
    deskripsi: string;
    foto: string | null;
    foto_url?: string | null;
    kategori_id: number | null;
    kategori?: { id: number; nama_kategori: string; slug: string } | null;
    latitude: string | null;
    longitude: string | null;
    harga_tiket: string | null;
    jam_buka: string | null;
    jam_tutup: string | null;
    kontak: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};
