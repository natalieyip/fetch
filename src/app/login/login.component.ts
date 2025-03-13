import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [MatInputModule, MatButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    onLoginBtn() {
        this.authService.login().then(() => {
            this.router.navigateByUrl('/dogs');
        });
    }
}
