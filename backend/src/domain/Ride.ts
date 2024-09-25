import UUID from "./UUID";
import Coord from "./Coord"

export default class Ride {
  private rideId: UUID
  private passengerId: UUID
  private from: Coord;
  private to: Coord;
  private status: string;
  private date: Date;

  constructor (rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date) {
      this.rideId = new UUID(rideId);
      this.passengerId = new UUID(passengerId);
      this.from = new Coord(fromLat, fromLong);
      this.to = new Coord(toLat, toLong);
      this.status = status;
      this.date = date;
  }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const uuid = UUID.create();
    const status = "requested"; 
    const date = new Date();
    return new Ride(uuid.getValue(), passengerId, fromLat, fromLong, toLat, toLong, status, date);
  }

  getRideId () {
    return this.rideId.getValue()
  }


  getPassengerId () {
    return this.passengerId.getValue()
  }

  getFrom () {
    return this.from;
  }

  getTo () {
    return this.to;
  }

  getStatus () {
    return this.status;
  }

  getDate () {
    return this.date;
  }

}