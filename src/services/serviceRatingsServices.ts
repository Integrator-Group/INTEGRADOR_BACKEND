import { ServiceRatingsRepository } from "../repositories/serviceRatingsRepository";
import { ServiceRatings, ServiceRatingsCreate } from "../models/Service_Ratings";

export class ServiceRatingsServices {
    private serviceRatingRepository: ServiceRatingsRepository;

    constructor() {
        this.serviceRatingRepository = new ServiceRatingsRepository();
    }

    async createRating(rating : ServiceRatingsCreate): Promise<ServiceRatings> {
        try {
            return await this.serviceRatingRepository.create(rating);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
              }
              throw new Error("Error al crear la sucursal: " + (error instanceof Error ? error.message : "Error desconocido"));
        }
    }
}