import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DogListComponent } from './dog-list/dog-list.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'dogs', component: DogListComponent },
];
