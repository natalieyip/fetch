import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dog } from '../../models/dog.model';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dog-card',
    imports: [MatIconModule, CommonModule],
    templateUrl: './dog-card.component.html',
    styleUrl: './dog-card.component.scss',
})
export class DogCardComponent {
    @Input()
    dogDetails: Dog;

    @Output()
    favoritedDog = new EventEmitter<Dog>();

    onFavorite() {
        this.dogDetails.is_favorite = !this.dogDetails.is_favorite;
        this.favoritedDog.emit(this.dogDetails);
    }
}
