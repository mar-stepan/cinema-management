import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'cinemas-wrapper',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class CinemasWrapper {}
