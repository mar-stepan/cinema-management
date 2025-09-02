export const BasePathConst = {
    Dashboard: "dashboard",
    Movies: "movies",
    Cinemas: "cinemas",
    Bookings: "bookings",
} as const satisfies Record<string, string>;

export type BasePath = (typeof BasePathConst)[keyof typeof BasePathConst];
