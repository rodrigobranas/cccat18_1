import { inject } from "../../infra/DI/DI";
import RideRepository from "../../infra/Repository/RideRepository";


//Use Case
export default class GetRide {
  @inject("rideRepository")
  rideRepository?: RideRepository;

  // Dependency Inversion Principle - Dependency Injection
  async execute(rideId: string): Promise<Output>{
    
    // Orquestrando recursos
    const ride = await this.rideRepository?.getRideById(rideId);
    if (!ride) throw new Error("Ride not Found")
    return {
      rideId: ride.getRideId(),
      passengerId: ride.getPassengerId(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      status: ride.getStatus(),
      date: ride.getDate(),
    }
  }
}

type Output = {
  rideId:string,
  passengerId:string,
  fromLat: number,
  fromLong: number,
  toLat: number,
  toLong: number,
  status: string,
  date: Date
}