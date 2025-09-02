import { Component, computed, inject } from '@angular/core';
import { Card } from "primeng/card";
import { PrimeTemplate } from "primeng/api";
import { TableModule } from "primeng/table";
import { API_URL } from "@di";
import { HttpClient } from "@angular/common/http";
import { rxResource } from "@angular/core/rxjs-interop";
import { BookingResponse } from "@interfaces";

@Component({
    selector: 'bookings',
    standalone: true,
    imports: [
        Card,
        PrimeTemplate,
        TableModule
    ],
    templateUrl: './bookings.html',
    styleUrl: './bookings.scss'
})
export class Bookings {
    readonly #apiUrl = inject(API_URL);
    readonly #http = inject(HttpClient);

    readonly bookingsResource = rxResource({
        stream: () => this.#http.get<BookingResponse>(`${this.#apiUrl}/bookings`)
    });

    readonly totalElements = computed(() => this.bookingsResource.value()?.totalElements || 0);
    readonly content = computed(() => this.bookingsResource.value()?.content || []);
}
