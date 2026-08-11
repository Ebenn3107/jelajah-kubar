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
            <Head title="Log in" />

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
                                    Email address
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
                                        placeholder="email@example.com"
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
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            tabIndex={5}
                                            className="text-sm font-semibold text-brand no-underline hover:text-brand-hover"
                                        >
                                            Forgot password?
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
                                    Remember me
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
                                Sign in
                            </Button>
                        </div>

                        <div className="pt-4">
                            <div className="relative">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 flex items-center"
                                >
                                    <div className="w-full border-t border-line" />
                                </div>
                                <div className="relative flex justify-center text-sm font-medium leading-6">
                                    <span className="bg-white px-6 text-[12px] font-medium tracking-wider text-ink-muted uppercase">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-gray-300 transition-colors ring-inset hover:bg-gray-50"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="size-5"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                            fill="#EA4335"
                                        />
                                        <path
                                            d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26538 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                            fill="#34A853"
                                        />
                                    </svg>
                                    <span className="text-sm font-semibold text-ink">
                                        Google
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    className="flex w-full items-center justify-center gap-3 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-ink shadow-sm ring-1 ring-gray-300 transition-colors ring-inset hover:bg-gray-50"
                                >
                                    <svg
                                        aria-hidden="true"
                                        className="size-5 text-ink"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                    <span className="text-sm font-semibold text-ink">
                                        GitHub
                                    </span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </Form>

            <p className="mt-10 text-center text-sm leading-6 text-ink-muted">
                Don't have an account?{' '}
                <TextLink
                    href={register()}
                    tabIndex={6}
                    className="font-semibold text-brand no-underline hover:text-brand-hover hover:underline"
                >
                    Sign up
                </TextLink>
            </p>
        </>
    );
}

Login.layout = {
    title: 'Welcome Back',
    description: 'Sign in to your account to continue planning your journey.',
    image: '/images/auth/sign-in-bg.png',
    sideTitle: 'Discover the Heart of Borneo.',
    sideDescription:
        'Immerse yourself in authentic cultural experiences and breathtaking landscapes.',
};
