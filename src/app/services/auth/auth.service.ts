import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    baseUrl: string = environment.fetchBaseUrl;

    constructor() {}

    async login(userName: string, userEmail: string) {
        return await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                email: userEmail,
            }),
        });
    }

    logout() {}
}
