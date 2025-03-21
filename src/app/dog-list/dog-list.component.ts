import { Component, OnInit } from '@angular/core';
import { DogService } from '../dog.service';
import { Dog } from '../dog/dog.model';
import { DogCardComponent } from '../dog/dog-card.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SortOptions } from '../sortOptions';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatchedDogModalComponent } from '../matched-dog-modal/matched-dog-modal.component';

@Component({
    selector: 'dog-list',
    imports: [
        DogCardComponent,
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatButtonModule,
        MatDialogModule,
    ],
    templateUrl: './dog-list.component.html',
    styleUrl: './dog-list.component.scss',
})
export class DogListComponent implements OnInit {
    dogBreedsFilter = new FormControl('');
    allDogBreeds: string[];
    allDogs: Dog[];
    selectedDogBreeds: string[];
    selectSortOption: string;
    sortOptions: SortOptions[] = [
        { option: 'name:asc', optionDisplay: 'Name: A-Z' },
        { option: 'name:desc', optionDisplay: 'Name: Z-A' },
        { option: 'breed:asc', optionDisplay: 'Breed: A-Z' },
        { option: 'breed:desc', optionDisplay: 'Breed: Z-A' },
        { option: 'age:asc', optionDisplay: 'Age: Low to High' },
        { option: 'age:desc', optionDisplay: 'Age: High to Low' },
    ];

    length: number;
    pageSize: number = 25;
    pageIndex = 0;
    pageSizeOptions = [25, 50, 100];

    hidePageSize = false;
    showPageSizeOptions = true;

    pageEvent: PageEvent;
    nextLink: string;
    prevLink: string;

    favoriteDogIds: string[] = [];

    constructor(
        private dogService: DogService,
        private dialogRef: MatDialog,
    ) {}

    ngOnInit(): void {
        this.dogService.getAllDogBreeds().subscribe((breeds) => {
            this.allDogBreeds = Object.values(breeds);
        });
        this.dogService.getAllDogs().subscribe((res: any) => {
            this.length = res.total;
            this.nextLink = res.next;
            this.dogService
                .searchDogs(res.resultIds)
                .then((r) => {
                    return r.json();
                })
                .then((data) => {
                    this.allDogs = data;
                });
        });
    }

    onSelectedDogs(selectedDogs: MatSelectChange) {
        this.selectedDogBreeds = selectedDogs.value;
        this.pageIndex = 0;
        this.pageSize = 25;
        this.dogService
            .getAllDogs(this.selectedDogBreeds, this.selectSortOption)
            .subscribe((res: any) => {
                this.length = res.total;
                this.nextLink = res.next;
                this.dogService
                    .searchDogs(res.resultIds)
                    .then((r) => {
                        return r.json();
                    })
                    .then((data) => {
                        this.allDogs = data;
                    });
            });
    }

    onSortChange(sortBy: MatSelectChange) {
        this.selectSortOption = sortBy.value.option;
        this.pageIndex = 0;
        this.dogService
            .getAllDogs(this.selectedDogBreeds, this.selectSortOption)
            .subscribe((res: any) => {
                this.length = res.total;

                this.dogService
                    .searchDogs(res.resultIds)
                    .then((r) => {
                        return r.json();
                    })
                    .then((data) => {
                        this.allDogs = data;
                    });
            });
    }

    handlePageEvent(e: PageEvent) {
        if (e.pageSize !== this.pageSize) {
            this.pageIndex = 0;
            this.dogService
                .getAllDogs(
                    this.selectedDogBreeds,
                    this.selectSortOption,
                    e.pageSize,
                )
                .subscribe((res: any) => {
                    this.dogService
                        .searchDogs(res.resultIds)
                        .then((r) => {
                            return r.json();
                        })
                        .then((data) => {
                            this.allDogs = data;
                        });
                });
        }

        if (e.pageIndex > 0 && e.previousPageIndex < e.pageIndex) {
            this.dogService
                .getNextOrPreviousPage(this.nextLink)
                .subscribe((res: any) => {
                    this.prevLink = res.prev;

                    if (res.next) {
                        this.nextLink = res.next;
                    }
                    this.dogService
                        .searchDogs(res.resultIds)
                        .then((r) => {
                            return r.json();
                        })
                        .then((data) => {
                            this.allDogs = data;
                        });
                });
        } else if (e.previousPageIndex > e.pageIndex) {
            this.dogService
                .getNextOrPreviousPage(this.prevLink)
                .subscribe((res: any) => {
                    if (res.prev) {
                        this.prevLink = res.prev;
                    }
                    this.nextLink = res.next;
                    this.dogService
                        .searchDogs(res.resultIds)
                        .then((r) => {
                            return r.json();
                        })
                        .then((data) => {
                            this.allDogs = data;
                        });
                });
        }
        this.pageEvent = e;
        this.length = e.length;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
    }

    handleFavoriteDogs(event: any) {
        if (event.is_favorite) {
            this.favoriteDogIds.push(event.id);
        } else {
            const dogIdIndex = this.favoriteDogIds.indexOf(event.id);
            this.favoriteDogIds.splice(dogIdIndex, 1);
        }
    }

    loadingNewBff() {
        if(!this.favoriteDogIds.length) {
            this.dialogRef.open(MatchedDogModalComponent, {
                width: '500px'
            });
            return;
        }
            this.dogService
                .matchDogs(this.favoriteDogIds)
                .then((r) => {
                    return r.json();
                })
                .then((dogData) => {
                    this.dogService
                        .searchDogs([dogData.match])
                        .then((r) => {
                            return r.json();
                        })
                        .then((dd) => {
                            this.dialogRef.open(MatchedDogModalComponent, {
                                width: '500px',
                                data: { dogDetails: dd },
                            });
                        });
                });
        
    }
}
