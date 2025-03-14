import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DogListComponent } from './dog-list/dog-list.component';

export const routes: Routes = [
    { path: 'dogs', component: DogListComponent },
    { path: '', component: LoginComponent },
    { path: '**', component: LoginComponent },
];
