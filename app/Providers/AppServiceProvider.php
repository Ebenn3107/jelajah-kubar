<?php

namespace App\Providers;

use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureRateLimiting();
    }

    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }

    protected function configureRateLimiting(): void
    {
        RateLimiter::for('ai', function (Request $request) {
            $user = $request->user();

            if (! $user) {
                return Limit::none();
            }

            // Max 10 AI calls per minute per user
            return Limit::perMinute(10)->by('ai:' . $user->id);
        });

        RateLimiter::for('review', function (Request $request) {
            $user = $request->user();

            if (! $user) {
                return Limit::none();
            }

            // Max 5 reviews per hour per user
            return Limit::perHour(5)->by('review:' . $user->id);
        });
    }
}
