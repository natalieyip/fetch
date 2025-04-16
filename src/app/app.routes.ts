import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DogListComponent } from './components/dog-list/dog-list.component';

export const routes: Routes = [
    { path: 'dogs', component: DogListComponent },
    { path: '', component: LoginComponent },
    { path: '**', component: LoginComponent },
];
