import { Component, computed, inject } from '@angular/core';
import { Button } from "primeng/button";
import { Card } from "primeng/card";
import { TableModule } from "primeng/table";
import { HttpClient } from "@angular/common/http";
import { DialogService } from "primeng/dynamicdialog";
import { rxResource } from "@angular/core/rxjs-interop";
import { tap } from "rxjs";
import { CreateNamePopup } from "./components/create-name-popup/create-name-popup";
import { Router } from "@angular/router";
import { API_URL } from "@di";
import { BasePathConst } from "@constants";
import { CinemaResponse } from "@interfaces";

@Component({
    selector: 'cinemas',
    standalone: true,
    imports: [
        Button,
        Card,
        TableModule
    ],
    templateUrl: './cinemas.html',
    styleUrl: './cinemas.scss',
    providers: [DialogService]
})
export class CinemasComponent {
    readonly #apiUrl = inject(API_URL);
    readonly #router = inject(Router);
    readonly #http = inject(HttpClient);
    readonly #dialogService = inject(DialogService);

    readonly cinemasResource = rxResource({
        stream: () => this.#http.get<CinemaResponse>(`${this.#apiUrl}/cinemas`)
    });

    readonly totalElements = computed(() => this.cinemasResource.value()?.totalElements || 0);
    readonly content = computed(() => this.cinemasResource.value()?.content || []);

    createCinemaPopup(): void {
        this.#dialogService.open(CreateNamePopup, {
            header: 'Create Cinema',
            focusOnShow: false,
            closable: true,
            modal: true,
            data: {
                submit: (data: { name: string }) => this.#http.put<void>(`${this.#apiUrl}/cinemas`, data).pipe(tap({
                    next: () => this.cinemasResource.reload()
                }))
            }
        })
    }

    createScreenPopup(cinemaId: string): void {
        this.#dialogService.open(CreateNamePopup, {
            header: 'Create Screen',
            focusOnShow: false,
            closable: true,
            modal: true,
            data: {
                submit: (data: {
                    name: string
                }) => this.#http.put<void>(`${this.#apiUrl}/cinemas/${cinemaId}/screens`, data).pipe(tap({
                    next: () => this.cinemasResource.reload()
                }))
            }
        })
    }

    checkScreenings(cinemaId: string, screenId: string): void {
        this.#router.navigate([`/${BasePathConst.Cinemas}/${cinemaId}/screens/${screenId}/screenings`]);
    }
}
