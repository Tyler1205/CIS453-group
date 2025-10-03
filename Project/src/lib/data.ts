import type { Vehicle, Booking } from './types';

export const vehicles: Vehicle[] = [
  { id: '1', name: 'Prestige Sedan', type: 'Sedan', pricePerDay: 85, availability: 'Available', imageId: 'car1' },
  { id: '2', name: 'Urban Explorer SUV', type: 'SUV', pricePerDay: 110, availability: 'Available', imageId: 'car2' },
  { id: '3', name: 'Heavy-Duty Truck', type: 'Truck', pricePerDay: 150, availability: 'Rented', imageId: 'car3' },
  { id: '4', name: 'Family Tour Van', type: 'Van', pricePerDay: 130, availability: 'Available', imageId: 'car4' },
  { id: '5', name: 'Compact Commuter', type: 'Sedan', pricePerDay: 60, availability: 'Available', imageId: 'car5' },
  { id: '6', name: 'All-Terrain SUV', type: 'SUV', pricePerDay: 125, availability: 'Available', imageId: 'car6' },
  { id: '7', name: 'Eco-Friendly Sedan', type: 'Sedan', pricePerDay: 75, availability: 'Available', imageId: 'car7' },
  { id: '8', name: 'Luxury SUV', type: 'SUV', pricePerDay: 200, availability: 'Rented', imageId: 'car8' },
  { id: '9', name: 'Workhorse Truck', type: 'Truck', pricePerDay: 160, availability: 'Available', imageId: 'car9' },
];

export const bookings: Booking[] = [
    {
        id: 'bk1',
        vehicle: vehicles[1],
        pickupDate: new Date('2024-08-10'),
        returnDate: new Date('2024-08-15'),
        totalPrice: 550,
    },
    {
        id: 'bk2',
        vehicle: vehicles[4],
        pickupDate: new Date('2024-09-01'),
        returnDate: new Date('2024-09-05'),
        totalPrice: 240,
    }
];

export const carTypes = ['Sedan', 'SUV', 'Truck', 'Van'];
