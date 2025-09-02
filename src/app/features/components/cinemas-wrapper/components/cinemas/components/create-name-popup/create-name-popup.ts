import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { finalize } from "rxjs";
import { Button } from "primeng/button";
import { InputText } from "primeng/inputtext";

@Component({
  selector: 'create-name-popup',
  imports: [
    Button,
    InputText,
    ReactiveFormsModule
  ],
  templateUrl: './create-name-popup.html',
  styleUrl: './create-name-popup.scss',
})
export class CreateNamePopup {
  readonly #fb = inject(FormBuilder);
  readonly #messageService = inject(MessageService);
  readonly #dynamicDialogRef = inject(DynamicDialogRef);
  readonly #dynamicDialogConfig = inject<DynamicDialogConfig>(DynamicDialogConfig);

  readonly form = this.#fb.group({
    name: ['']
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
