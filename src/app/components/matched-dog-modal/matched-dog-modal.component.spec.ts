import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedDogModalComponent } from './matched-dog-modal.component';

describe('MatchedDogModalComponent', () => {
    let component: MatchedDogModalComponent;
    let fixture: ComponentFixture<MatchedDogModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatchedDogModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MatchedDogModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
