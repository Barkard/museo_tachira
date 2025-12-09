import { Config, InputParams, Router } from 'ziggy-js';

declare global {
    function route(): Router;
    function route(name: string, params?: InputParams, absolute?: boolean, config?: Config): string;
}

declare module '@inertiajs/core' {
    interface PageProps {
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                email_verified_at: string | null;
            };
        };
        ziggy: Config & { location: string };
    }
}
