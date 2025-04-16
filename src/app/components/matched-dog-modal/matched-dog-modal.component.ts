import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Dog } from '../../models/dog.model';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-matched-dog-modal',
    imports: [MatDialogModule, MatButtonModule, CommonModule],
    templateUrl: './matched-dog-modal.component.html',
    styleUrl: './matched-dog-modal.component.scss',
})
export class MatchedDogModalComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
    dogDetails: Dog;

    ngOnInit() {
        this.dogDetails = this.data.dogDetails[0];
    }
}
