import { Injectable } from '@angular/core';
import { environment } from '../../environment';
import { HttpClient, HttpParams } from '@angular/common/http';

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

    getAllDogs(dogBreeds?: string[], sortField: string = 'name:asc', pageSize: number = 25) {
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

    getNextOrPreviousPage(link: string) {
        return this.httpClient.get(`${this.baseUrl}${link}`, {
            withCredentials: true,
        });
    }

    async searchDogs(dogIds: string[]) {
        return await fetch(`${this.baseUrl}/dogs`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dogIds),
        });
    }
}
