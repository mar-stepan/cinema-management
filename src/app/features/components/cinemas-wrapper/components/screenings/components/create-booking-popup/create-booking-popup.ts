import { Component, inject, signal } from '@angular/core';
import { Button } from "primeng/button";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { finalize } from "rxjs";
import { InputNumber } from "primeng/inputnumber";

@Component({
  selector: 'create-booking-popup',
  imports: [
    Button,
    ReactiveFormsModule,
    InputNumber
  ],
  templateUrl: './create-booking-popup.html',
  styleUrl: './create-booking-popup.scss'
})
export class CreateBookingPopup {
  readonly #fb = inject(FormBuilder);
  readonly #messageService = inject(MessageService);
  readonly #dynamicDialogRef = inject(DynamicDialogRef);
  readonly #dynamicDialogConfig = inject<DynamicDialogConfig>(DynamicDialogConfig);

  readonly form = this.#fb.group({
    seat: [0, [Validators.required, Validators.min(1)]],
  });

  readonly isLoading = signal<boolean>(false);

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.isLoading.set(true);

    this.#dynamicDialogConfig.data.submit(this.form.value.seat).pipe(finalize(() => this.isLoading.set(false))).subscribe({
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
