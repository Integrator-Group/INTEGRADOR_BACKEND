export interface ServiceRatings {
    id: number;
    id_appointment: number;
    id_user: number;
    rating: number;
    comment: string;
}

export interface ServiceRatingsCreate {
    id_appointment: number;
    id_user: number;
    rating: number;
    comment: string;
}