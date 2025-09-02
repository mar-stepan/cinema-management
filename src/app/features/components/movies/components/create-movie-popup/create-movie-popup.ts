import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputText } from "primeng/inputtext";
import { InputNumber } from 'primeng/inputnumber';
import { Button } from "primeng/button";
import { finalize } from "rxjs";
import { MessageService } from "primeng/api";

@Component({
    selector: 'create-movie-popup',
    imports: [
        ReactiveFormsModule,
        InputText,
        InputNumber,
        Button
    ],
    templateUrl: './create-movie-popup.html',
    styleUrl: './create-movie-popup.scss',
})
export class CreateMoviePopup {
    readonly #fb = inject(FormBuilder);
    readonly #messageService = inject(MessageService);
    readonly #dynamicDialogRef = inject(DynamicDialogRef);
    readonly #dynamicDialogConfig = inject<DynamicDialogConfig>(DynamicDialogConfig);

    readonly form = this.#fb.group({
        name: ['', Validators.required],
        runtime: [0, [Validators.required, Validators.min(1)]]
    });

    readonly isLoading = signal<boolean>(false);

    save(): void {
        if (this.form.invalid) {
            return;
        }
        this.isLoading.set(true);

        this.#dynamicDialogConfig.data.submit(this.form.value).pipe(finalize(() => this.isLoading.set(false))).subscribe({
            next: () => {
                this.#messageService.add({ severity: 'success', summary: 'Success', detail: 'Item added successfully' });
                this.cancel();
            },
        })
    }

    cancel(): void {
        this.#dynamicDialogRef.close();
    }
}
