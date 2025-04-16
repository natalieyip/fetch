import { Component, OnInit } from '@angular/core';
import { DogService } from '../../services/dog/dog.service';
import { Dog } from '../../models/dog.model';
import { DogCardComponent } from '../dog/dog-card.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SortOptions } from '../../models/sort-options.model';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatchedDogModalComponent } from '../matched-dog-modal/matched-dog-modal.component';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { PaginationTrigger } from '../../models/pagination-trigger.model';

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

    pagination$: BehaviorSubject<PaginationTrigger> = new BehaviorSubject<PaginationTrigger>({
        type: 'filters',
        pageIndex: 0,
        pageSize: 25
    });

    dogs$: Observable<Dog[]>;

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

        this.dogs$ = this.pagination$.pipe(
            switchMap((event) => {
              if (event.type === 'next' || event.type === 'prev') {
                return this.dogService.getNextOrPreviousPage(event.link).pipe(
                  tap((res: any) => {
                    this.length = res.total;
                    this.nextLink = res.next;
                    this.prevLink = res.prev;
                  }),
                  switchMap(res => this.dogService.searchDogs(res.resultIds))
                );
              } else {
                return this.dogService.getAllDogs(
                  this.selectedDogBreeds,
                  this.selectSortOption,
                  event.pageSize
                ).pipe(
                  tap((res: any) => {
                    this.length = res.total;
                    this.pageIndex = event.pageIndex;
                    this.pageSize = event.pageSize;
                    this.nextLink = res.next;
                    this.prevLink = res.prev;
                  }),
                  switchMap(res => this.dogService.searchDogs(res.resultIds))
                );
              }
            })
          );
    }

    onSelectedDogs(selectedDogs: MatSelectChange) {
        this.selectedDogBreeds = selectedDogs.value;
        this.pagination$.next({ type: 'filters', pageIndex: 0, pageSize: this.pageSize });

    }

    onSortChange(sortBy: MatSelectChange) {
        this.selectSortOption = sortBy.value.option;
        this.pagination$.next({ type: 'filters', pageIndex: 0, pageSize: this.pageSize });
    }

    handlePageEvent(event: PageEvent) {
        const isNext = event.pageIndex > this.pageIndex;
        const isPrev = event.pageIndex < this.pageIndex;
        const pageSizeChange = event.pageSize !== this.pageSize;

        if (pageSizeChange) {
            this.pagination$.next({
                type: 'filters',
                pageIndex: 0,
                pageSize: event.pageSize
              });
              this.pageIndex = 0;
        } else if (isNext && this.nextLink) {
          this.pagination$.next({ type: 'next', link: this.nextLink });
          this.pageIndex= event.pageIndex;
        } else if (isPrev && this.prevLink) {
          this.pagination$.next({ type: 'prev', link: this.prevLink });
          this.pageIndex= event.pageIndex;
        }
        this.pageSize = event.pageSize;
    }

    handleFavoriteDogs(event: Dog) {
        if (event.is_favorite) {
            this.favoriteDogIds.push(event.id);
        } else {
            const dogIdIndex = this.favoriteDogIds.indexOf(event.id);
            this.favoriteDogIds.splice(dogIdIndex, 1);
        }
    }

    findMyBestFriend() {
        if (!this.favoriteDogIds.length) {
            this.dialogRef.open(MatchedDogModalComponent, {
                width: '500px',
            });
            return;
        }
        this.dogService
            .matchDogs(this.favoriteDogIds)
            .pipe(
                switchMap((matchData) =>
                    this.dogService.searchDogs([matchData.match]),
                ),
            )
            .subscribe((dogDetails) => {
                this.dialogRef.open(MatchedDogModalComponent, {
                    width: '500px',
                    data: { dogDetails },
                });
            });
    }
}
