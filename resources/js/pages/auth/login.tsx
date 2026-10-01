import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

const inputClassName =
    'h-auto w-full rounded-lg border-line bg-white px-4 py-3 text-[15px] text-ink shadow-sm transition-all duration-200 placeholder:text-[#6d7a77] focus-visible:border-brand focus-visible:ring-brand/20 sm:text-sm';

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Masuk" />

            {status && (
                <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div>
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold leading-5 text-ink"
                                >
                                    Alamat email
                                </Label>
                                <div className="mt-2">
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@contoh.com"
                                        className={inputClassName}
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold leading-5 text-ink"
                                    >
                                        Kata sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            tabIndex={5}
                                            className="text-sm font-semibold text-brand no-underline hover:text-brand-hover"
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={inputClassName}
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="h-4 w-4 rounded border-line bg-white text-brand data-[state=checked]:border-brand data-[state=checked]:bg-brand focus-visible:border-brand focus-visible:ring-brand/20"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="ml-3 text-sm text-ink-muted"
                                >
                                    Ingat saya
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="h-auto w-full rounded-lg bg-brand px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-hover focus-visible:border-brand focus-visible:ring-brand/30 active:scale-[0.98]"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            <p className="mt-10 text-center text-sm leading-6 text-ink-muted">
                Belum punya akun?{' '}
                <TextLink
                    href={register()}
                    tabIndex={6}
                    className="font-semibold text-brand no-underline hover:text-brand-hover hover:underline"
                >
                    Daftar
                </TextLink>
            </p>
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang Kembali',
    description: 'Masuk ke akun Anda untuk melanjutkan perencanaan perjalanan.',
    image: '/images/auth/sign-in-bg.png',
    sideTitle: 'Temukan Jantung Borneo.',
    sideDescription:
        'Rasakan budaya yang autentik dan lanskap alam yang memukau.',
};
