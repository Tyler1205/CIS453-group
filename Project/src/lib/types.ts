export type Vehicle = {
  id: string;
  name: string;
  type: 'Sedan' | 'SUV' | 'Truck' | 'Van';
  pricePerDay: number;
  availability: 'Available' | 'Rented';
  imageId: string;
};

export type Booking = {
  id: string;
  vehicle: Vehicle;
  pickupDate: Date;
  returnDate: Date;
  totalPrice: number;
};
