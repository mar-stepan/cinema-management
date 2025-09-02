import { InjectionToken, ValueProvider } from '@angular/core';

export const API_URL = new InjectionToken<string>('ApiUrl');

export function registerApiUrlTokens({ apiUrl }: RegisterApiUrlTokensOptions): ValueProvider[] {
    return [
        {
            provide: API_URL,
            useValue: apiUrl,
        },
    ];
}

interface RegisterApiUrlTokensOptions {
    apiUrl: string;
}
