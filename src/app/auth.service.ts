import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl: string = environment.fetchBaseUrl;

    constructor() {}

    async login() {
        return await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Tess',
                email: 'tess@gmail.com',
            }),
        });
    }

    logout() {}
}
