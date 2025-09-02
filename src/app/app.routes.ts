import { Routes } from '@angular/router';
import { LayoutComponent } from "./core/components/layout/layout.component";
import { BasePathConst } from "@constants";

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: BasePathConst.Dashboard,
                loadChildren: () => import('./features/components/dashboard/dashboard.routes').then(r => r.DashboardRoutes)
            },
            {
                path: BasePathConst.Movies,
                loadChildren: () => import('./features/components/movies/movies.routes').then(r => r.MoviesRoutes)
            },
            {
                path: BasePathConst.Cinemas,
                loadChildren: () => import('./features/components/cinemas-wrapper/cinemas-wrapper.routes').then(r => r.CinemasWrapperRoutes)
            },
            {
                path: BasePathConst.Bookings,
                loadChildren: () => import('./features/components/bookings/bookings.routes').then(r => r.BookingsRoutes)
            },
            { path: '', redirectTo: BasePathConst.Dashboard, pathMatch: 'full' },
            { path: '**', redirectTo: BasePathConst.Dashboard },
        ]
    },
];
