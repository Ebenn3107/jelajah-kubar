import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

const inputClassName =
    'h-auto w-full rounded-lg border-line bg-white px-4 py-3 text-[15px] text-ink shadow-sm transition-all duration-200 placeholder:text-[#6d7a77] focus-visible:border-brand focus-visible:ring-brand/20 sm:text-sm';

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Daftar" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="space-y-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-5">
                            <div>
                                <Label
                                    htmlFor="name"
                                    className="text-sm font-semibold leading-5 text-ink"
                                >
                                    Nama lengkap
                                </Label>
                                <div className="mt-2">
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="mis. Budi Santoso"
                                        className={inputClassName}
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

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
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="anda@contoh.com"
                                        className={inputClassName}
                                    />
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-semibold leading-5 text-ink"
                                >
                                    Kata sandi
                                </Label>
                                <div className="mt-2">
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="••••••••"
                                        passwordrules={passwordRules}
                                        className={inputClassName}
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-semibold leading-5 text-ink"
                                >
                                    Konfirmasi kata sandi
                                </Label>
                                <div className="mt-2">
                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="••••••••"
                                        passwordrules={passwordRules}
                                        className={inputClassName}
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="flex items-start py-1">
                                <div className="flex h-6 items-center">
                                    <Checkbox
                                        id="terms"
                                        name="terms"
                                        tabIndex={5}
                                        className="h-4 w-4 rounded border-line bg-white text-brand data-[state=checked]:border-brand data-[state=checked]:bg-brand focus-visible:border-brand focus-visible:ring-brand/20"
                                    />
                                </div>
                                <div className="ml-3">
                                    <Label
                                        htmlFor="terms"
                                        className="text-xs leading-5 font-medium text-ink-muted"
                                    >
                                        Saya menyetujui{' '}
                                        <a
                                            href="#"
                                            className="text-brand hover:underline"
                                        >
                                            Syarat Layanan
                                        </a>{' '}
                                        serta{' '}
                                        <a
                                            href="#"
                                            className="text-brand hover:underline"
                                        >
                                            Kebijakan Privasi
                                        </a>
                                        .
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                tabIndex={6}
                                data-test="register-user-button"
                                className="h-auto w-full rounded-lg bg-brand px-3 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-hover focus-visible:border-brand focus-visible:ring-brand/30 active:scale-[0.98]"
                            >
                                {processing && <Spinner />}
                                Daftar
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            <p className="mt-10 text-center text-sm leading-6 text-ink-muted">
                Sudah punya akun?{' '}
                <TextLink
                    href={login()}
                    tabIndex={7}
                    className="font-semibold text-brand no-underline hover:text-brand-hover hover:underline"
                >
                    Masuk di sini
                </TextLink>
            </p>
        </>
    );
}

Register.layout = {
    title: 'Buat Akun',
    description: 'Mulai merencanakan petualangan budaya Anda.',
    image: '/images/auth/sign-up-bg.png',
    sideTitle: 'Temukan Jantung Borneo',
    sideDescription: 'Bergabunglah dengan Jelajah Kubar dan mulai perjalanan autentik Anda.',
};
