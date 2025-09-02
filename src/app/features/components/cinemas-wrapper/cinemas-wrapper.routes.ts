import { Routes } from "@angular/router";
import { CinemasComponent } from "./components/cinemas/cinemas";
import { CinemasWrapper } from "./cinemas-wrapper";

export const CinemasWrapperRoutes: Routes = [
    {
        path: '',
        component: CinemasWrapper,
        children: [
            {
                path: '',
                component: CinemasComponent,
            },
            {
                path: `:cinemaId/screens/:screenId/screenings`,
                loadComponent: () => import('./components/screenings/screenings').then(c => c.Screenings)
            }
        ]
    }
];
