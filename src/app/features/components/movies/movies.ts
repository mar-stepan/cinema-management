import { Component, computed, inject } from '@angular/core';
import { API_URL } from "@di";
import { rxResource } from "@angular/core/rxjs-interop";
import { HttpClient } from "@angular/common/http";
import { Card } from "primeng/card";
import { TableModule } from "primeng/table";
import { Button } from "primeng/button";
import { DialogService } from "primeng/dynamicdialog";
import { CreateMoviePopup } from "./components/create-movie-popup/create-movie-popup";
import { tap } from "rxjs";
import { MovieResponse } from "@interfaces";

@Component({
    selector: 'movies',
    standalone: true,
    imports: [
        Card,
        TableModule,
        Button
    ],
    templateUrl: './movies.html',
    styleUrl: './movies.scss',
    providers: [DialogService]
})
export class Movies {
    readonly #apiUrl = inject(API_URL);
    readonly #http = inject(HttpClient);
    readonly #dialogService = inject(DialogService);

    readonly moviesResource = rxResource({
        stream: () => this.#http.get<MovieResponse>(`${this.#apiUrl}/movies`)
    });

    readonly totalElements = computed(() => this.moviesResource.value()?.totalElements || 0);
    readonly content = computed(() => this.moviesResource.value()?.content || []);

    createMoviePopup(): void {
        this.#dialogService.open(CreateMoviePopup, {
            header: 'Create Movie',
            focusOnShow: false,
            closable: true,
            modal: true,
            data: {
                submit: (movie: {
                    name: string;
                    runtime: number
                }) => this.#http.put(`${this.#apiUrl}/movies`, movie).pipe(tap({
                    next: () => this.moviesResource.reload()
                }))
            }
        })
    }
}
