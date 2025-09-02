import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Sidebar } from "./components/sidebar/sidebar";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@Component({
    selector: 'layout',
    standalone: true,
    imports: [
        RouterOutlet,
        Sidebar,
        ToastModule
    ],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    providers: [MessageService]
})
export class LayoutComponent {}
