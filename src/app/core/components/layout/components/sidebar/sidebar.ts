import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";
import { BasePath, BasePathConst } from "@constants";

@Component({
    selector: 'sidebar',
    standalone: true,
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss'
})
export class Sidebar {
    readonly #router = inject(Router)

    readonly sideMenu = [
        { label: 'Dashboard', route: BasePathConst.Dashboard},
        { label: 'Cinemas', route: BasePathConst.Cinemas },
        { label: 'Movies', route: BasePathConst.Movies},
        { label: 'Bookings', route: BasePathConst.Bookings }
    ];

    readonly url = toSignal(
        this.#router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.#router.url),
            startWith(this.#router.url),
        ),
        { initialValue: '' }
    );

    navigate(route: BasePath): void {
        this.#router.navigate([route]);
    }
}
