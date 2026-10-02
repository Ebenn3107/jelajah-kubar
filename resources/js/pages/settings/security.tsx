import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import type { Props as ManagePasskeysProps } from '@/components/manage-passkeys';
import ManagePasskeys from '@/components/manage-passkeys';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';

type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

const inputClass = 'mt-1.5 h-auto rounded-xl border-line bg-white px-4 py-3 text-ink';
const labelClass = 'text-sm font-semibold text-ink';

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Pengaturan keamanan" />

            <h1 className="sr-only">Pengaturan keamanan</h1>

            <div className="rounded-3xl border border-line bg-white p-6 md:p-8">
                <Heading
                    variant="small"
                    title="Ubah kata sandi"
                    description="Gunakan kata sandi yang panjang dan acak agar akun tetap aman."
                />

                <Form
                    {...SecurityController.update.form()}
                    options={{ preserveScroll: true }}
                    resetOnError={['password', 'password_confirmation', 'current_password']}
                    resetOnSuccess
                    onError={(errors) => {
                        if (errors.password) {
                            passwordInput.current?.focus();
                        }

                        if (errors.current_password) {
                            currentPasswordInput.current?.focus();
                        }
                    }}
                    className="mt-6 space-y-5"
                >
                    {({ errors, processing }) => (
                        <>
                            <div>
                                <label htmlFor="current_password" className={labelClass}>
                                    Kata sandi saat ini
                                </label>
                                <PasswordInput
                                    id="current_password"
                                    ref={currentPasswordInput}
                                    name="current_password"
                                    className={inputClass}
                                    autoComplete="current-password"
                                    placeholder="Kata sandi saat ini"
                                    aria-invalid={Boolean(errors.current_password)}
                                />
                                <InputError className="mt-2" message={errors.current_password} />
                            </div>

                            <div>
                                <label htmlFor="password" className={labelClass}>
                                    Kata sandi baru
                                </label>
                                <PasswordInput
                                    id="password"
                                    ref={passwordInput}
                                    name="password"
                                    className={inputClass}
                                    autoComplete="new-password"
                                    placeholder="Kata sandi baru"
                                    passwordrules={props.passwordRules}
                                    aria-invalid={Boolean(errors.password)}
                                />
                                <InputError className="mt-2" message={errors.password} />
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className={labelClass}>
                                    Konfirmasi kata sandi baru
                                </label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className={inputClass}
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi baru"
                                    passwordrules={props.passwordRules}
                                    aria-invalid={Boolean(errors.password_confirmation)}
                                />
                                <InputError className="mt-2" message={errors.password_confirmation} />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                data-test="update-password-button"
                                className="rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan…' : 'Perbarui kata sandi'}
                            </button>
                        </>
                    )}
                </Form>
            </div>

            <ManageTwoFactor
                canManageTwoFactor={props.canManageTwoFactor}
                requiresConfirmation={props.requiresConfirmation}
                twoFactorEnabled={props.twoFactorEnabled}
            />

            <ManagePasskeys
                canManagePasskeys={props.canManagePasskeys}
                passkeys={props.passkeys}
            />

            <DeleteUser />
        </>
    );
}
