export interface CinemaResponse {
    totalElements: number;
    content: {
        id: number;
        name: string;
        screens: {
            id: number;
            name: string;
        }[];
    }[];
}
