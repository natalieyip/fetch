import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    imports: [MatInputModule, MatButtonModule, ReactiveFormsModule, MatError, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {

    loginForm: FormGroup; 
    
    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
    ) {
        this.loginForm = this.fb.group({
            name: ['', [Validators.required, Validators.maxLength(256)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(256)]],
          });
    }

    onLoginBtn() {
        if (this.loginForm.valid) {
            const { name, email } = this.loginForm.value;
            this.authService.login(name, email).then(() => {
              this.router.navigateByUrl('/dogs');
            });
          } else {
            this.loginForm.markAllAsTouched();
          }
    }
}
