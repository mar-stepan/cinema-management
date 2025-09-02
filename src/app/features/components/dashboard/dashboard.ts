import { Component, inject, OnInit, signal } from '@angular/core';
import { API_URL } from "@di";
import { HttpClient } from "@angular/common/http";
import { catchError, forkJoin, map, of } from "rxjs";
import { BookingResponse, CinemaResponse, MovieResponse } from "@interfaces";
import { NgTemplateOutlet } from "@angular/common";
import { Card } from "primeng/card";

@Component({
    selector: 'dashboard',
    standalone: true,
    templateUrl: './dashboard.html',
    imports: [
        NgTemplateOutlet,
        Card
    ],
    styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
    readonly #apiUrl = inject(API_URL);
    readonly #http = inject(HttpClient);

    readonly totalCinemas = signal<number>(0);
    readonly totalScreens = signal<number>(0);
    readonly totalMovies = signal<number>(0);
    readonly totalBookings = signal<number>(0);

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        forkJoin([
            this.#http.get<CinemaResponse>(`${this.#apiUrl}/cinemas`).pipe(
                map(response => {
                    const totalCinemas = response.totalElements;
                    const totalScreens = response.content.reduce((acc, content) => acc + content.screens.length, 0);
                    return [totalCinemas, totalScreens];
                }),
                catchError(() => of([0, 0]))
            ),
            this.#http.get<MovieResponse>(`${this.#apiUrl}/movies`).pipe(
                map(response => response.totalElements),
                catchError(() => of(0))
            ),
            this.#http.get<BookingResponse>(`${this.#apiUrl}/bookings`).pipe(
                map(response => response.totalElements),
                catchError(() => of(0))
            ),
        ]).subscribe({
            next: ([[totalCinemas, totalScreens], totalMovies, totalBookings]) => {
                this.totalCinemas.set(totalCinemas);
                this.totalScreens.set(totalScreens);
                this.totalMovies.set(totalMovies);
                this.totalBookings.set(totalBookings);
            }
        })
    }
}
