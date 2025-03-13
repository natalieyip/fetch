import { Component, Input } from '@angular/core';
import { Dog } from './dog.model';

@Component({
    selector: 'dog-card',
    imports: [],
    templateUrl: './dog-card.component.html',
    styleUrl: './dog-card.component.scss',
})
export class DogCardComponent {
    @Input()
    dogDetails: Dog;
}
