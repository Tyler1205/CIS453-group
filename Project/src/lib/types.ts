import type { Timestamp } from 'firebase/firestore';

export type VehicleAvailability = 
  | { status: 'Available' }
  | { status: 'Rented', until: Date };

export type Vehicle = {
  id: string;
  name: string;
  type: 'Sedan' | 'SUV' | 'Truck' | 'Van';
  pricePerDay: number;
  availability: VehicleAvailability;
  imageId: string;
};

export type Booking = {
  id: string;
  userId: string;
  vehicleId: string;
  vehicleName: string;
  pickupDateTime: Date | Timestamp;
  returnDateTime: Date | Timestamp;
  bookingDate: Date | Timestamp;
  totalPrice: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  registrationDate: Date | Timestamp;
};
