export interface MovieResponse {
    totalElements: number;
    content: {
        id: number;
        name: string;
        runtime: number;
    }[]
}
