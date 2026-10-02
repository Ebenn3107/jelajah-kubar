import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { send } from '@/routes/verification';
import type { Auth } from '@/types';

const inputClass =
    'mt-1.5 block w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-outline focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const initial = auth.user.name.trim().charAt(0).toUpperCase() || '?';
    const unverified = mustVerifyEmail && auth.user.email_verified_at === null;

    return (
        <>
            <Head title="Pengaturan profil" />

            <h1 className="sr-only">Pengaturan profil</h1>

            <div className="flex items-center gap-4 rounded-3xl border border-line bg-white p-6">
                <div
                    className="flex size-16 shrink-0 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white"
                    aria-hidden="true"
                >
                    {initial}
                </div>
                <div className="min-w-0">
                    <p className="truncate text-lg font-bold text-ink">{auth.user.name}</p>
                    <p className="truncate text-sm text-ink-muted">{auth.user.email}</p>
                </div>
            </div>

            <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
                <Heading
                    variant="small"
                    title="Informasi profil"
                    description="Perbarui nama dan alamat email Anda."
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{ preserveScroll: true }}
                    className="mt-6 space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div>
                                <label htmlFor="name" className="text-sm font-semibold text-ink">
                                    Nama
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    className={inputClass}
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    placeholder="Nama lengkap"
                                />
                                <InputError className="mt-2" message={errors.name} />
                            </div>

                            <div>
                                <label htmlFor="email" className="text-sm font-semibold text-ink">
                                    Alamat email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className={inputClass}
                                    defaultValue={auth.user.email}
                                    required
                                    autoComplete="username"
                                    placeholder="nama@email.com"
                                />
                                <InputError className="mt-2" message={errors.email} />
                            </div>

                            {unverified && (
                                <div className="rounded-2xl bg-amber-soft/50 p-4 text-sm text-ink">
                                    <p>
                                        Alamat email Anda belum terverifikasi.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
                                        >
                                            Kirim ulang email verifikasi
                                        </Link>
                                    </p>
                                    {status === 'verification-link-sent' && (
                                        <p className="mt-2 font-semibold text-brand" role="status">
                                            Tautan verifikasi baru sudah dikirim ke email Anda.
                                        </p>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="update-profile-button"
                                className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan…' : 'Simpan perubahan'}
                            </button>
                        </>
                    )}
                </Form>
            </div>

            <DeleteUser />
        </>
    );
}
