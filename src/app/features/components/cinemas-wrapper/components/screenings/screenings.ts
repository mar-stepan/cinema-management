import { Component, computed, inject, input as routeBinding } from '@angular/core';
import { Button } from "primeng/button";
import { API_URL } from "@di";
import { HttpClient } from "@angular/common/http";
import { DialogService } from "primeng/dynamicdialog";
import { rxResource } from "@angular/core/rxjs-interop";
import { Card } from "primeng/card";
import { PrimeTemplate } from "primeng/api";
import { TableModule } from "primeng/table";
import { tap } from "rxjs";
import { DatePipe } from "@angular/common";
import { CreateScreeningPopup } from "./components/create-screening-popup/create-screening-popup";
import { CreateBookingPopup } from "./components/create-booking-popup/create-booking-popup";

@Component({
    selector: 'screenings',
    imports: [
        Button,
        Card,
        PrimeTemplate,
        TableModule,
        DatePipe
    ],
    templateUrl: './screenings.html',
    styleUrl: './screenings.scss',
    providers: [DialogService]
})
export class Screenings {
    readonly cinemaId = routeBinding.required<string>();
    readonly screenId = routeBinding.required<string>();

    readonly #apiUrl = inject(API_URL);
    readonly #http = inject(HttpClient);
    readonly #dialogService = inject(DialogService);

    readonly screeningsResource = rxResource({
        params: () => ({ cinemaId: this.cinemaId() }),
        stream: ({ params }) => this.#http.get<any>(`${this.#apiUrl}/cinemas/${params.cinemaId}/screenings`)
    });

    readonly totalElements = computed(() => this.screeningsResource.value()?.totalElements || 0);
    readonly content = computed(() => this.screeningsResource.value()?.content || []);

    createScreeningPopup(): void {
        this.#dialogService.open(CreateScreeningPopup, {
            header: 'Create Screening',
            focusOnShow: false,
            closable: true,
            modal: true,
            data: {
                submit: (data: {
                    movieId: string;
                    startTime: number
                }) => this.#http.put(`${this.#apiUrl}/cinemas/${this.cinemaId()}/screens/${this.screenId()}/screenings`, data).pipe(tap({
                    next: () => this.screeningsResource.reload()
                }))
            }
        })
    }

    openCreateBookingPopup(screeningId: string): void {
        this.#dialogService.open(CreateBookingPopup, {
            header: 'Create Booking',
            focusOnShow: false,
            closable: true,
            modal: true,
            data: {
                submit: (seat: number) => this.#http.put(`${this.#apiUrl}/bookings`, { screeningId, seat }).pipe(tap({
                    next: () => this.screeningsResource.reload()
                }))
            }
        })
    }
}
