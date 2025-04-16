import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Dog } from './dog/dog.model';

@Injectable({
    providedIn: 'root',
})
export class DogService {
    baseUrl: string = environment.fetchBaseUrl;

    constructor(private httpClient: HttpClient) {}

    getAllDogBreeds() {
        return this.httpClient.get(`${this.baseUrl}/dogs/breeds`, {
            withCredentials: true,
        });
    }

    getAllDogs(
        dogBreeds?: string[],
        sortField: string = 'name:asc',
        pageSize: number = 25,
    ) {
        let parameters = new HttpParams();

        if (dogBreeds && dogBreeds.length > 0) {
            dogBreeds.forEach((brd) => {
                parameters = parameters.append('breeds', brd);
            });
        }

        parameters = parameters.append('size', pageSize);
        parameters = parameters.append('sort', sortField);

        return this.httpClient.get(`${this.baseUrl}/dogs/search`, {
            params: parameters,
            withCredentials: true,
        });
    }

    matchDogs(dogIds?: string[]): Observable<{ match: string; }> {
        return from(
            fetch(`${this.baseUrl}/dogs/match`, { 
                method: 'POST', 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dogIds) 
            })
              .then((r) => r.json())
          );
    }

    getNextOrPreviousPage(link: string) {
        return this.httpClient.get(`${this.baseUrl}${link}`, {
            withCredentials: true,
        });
    }

    searchDogs(ids: string[]): Observable<Dog[]> {
        return from(
          fetch(`${this.baseUrl}/dogs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
          }).then((res) => res.json())
        );
      }
}
