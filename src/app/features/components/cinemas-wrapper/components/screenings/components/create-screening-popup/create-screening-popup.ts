import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Button } from "primeng/button";
import { catchError, finalize, map, of } from "rxjs";
import { Select } from "primeng/select";
import { toSignal } from "@angular/core/rxjs-interop";
import { API_URL } from "@di";
import { HttpClient } from "@angular/common/http";
import { DatePicker } from 'primeng/datepicker';
import { MovieResponse } from "@interfaces";

@Component({
    selector: 'create-screening-popup',
    imports: [
        Button,
        ReactiveFormsModule,
        Select,
        DatePicker,
    ],
    templateUrl: './create-screening-popup.html',
    styleUrl: './create-screening-popup.scss',
})
export class CreateScreeningPopup {
    readonly #apiUrl = inject(API_URL);
    readonly #http = inject(HttpClient);
    readonly #fb = inject(FormBuilder);
    readonly #messageService = inject(MessageService);
    readonly #dynamicDialogRef = inject(DynamicDialogRef);
    readonly #dynamicDialogConfig = inject<DynamicDialogConfig>(DynamicDialogConfig);

    readonly form = this.#fb.group({
        movieId: ['', Validators.required],
        startTime: [null, Validators.required]
    });

    readonly movies = toSignal(
        this.#http.get<MovieResponse>(`${this.#apiUrl}/movies`).pipe(
            map(response => response.content.map(movie => ({ label: movie.name, value: movie.id }))),
            catchError(() => of([]))
        ),
        { initialValue: [] }
    );

    readonly isLoading = signal<boolean>(false);

    save(): void {
        if (this.form.invalid) {
            return;
        }
        this.isLoading.set(true);

        this.#dynamicDialogConfig.data.submit(this.form.value).pipe(finalize(() => this.isLoading.set(false))).subscribe({
            next: () => {
                this.#messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Item added successfully',
                    life: 3000,
                });
                this.cancel();
            },
        })
    }

    cancel(): void {
        this.#dynamicDialogRef.close();
    }
}
