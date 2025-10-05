import type { Vehicle } from './types';

export const vehicles: Vehicle[] = [
  { id: '1', name: 'Prestige Sedan', type: 'Sedan', pricePerDay: 85, availability: 'Available', imageId: 'car1' },
  { id: '2', name: 'Urban Explorer SUV', type: 'SUV', pricePerDay: 110, availability: 'Available', imageId: 'car2' },
  { id: '3', name: 'Heavy-Duty Truck', type: 'Truck', pricePerDay: 150, availability: 'Available', imageId: 'car3' },
  { id: '4', name: 'Family Tour Van', type: 'Van', pricePerDay: 130, availability: 'Available', imageId: 'car4' },
  { id: '5', name: 'Compact Commuter', type: 'Sedan', pricePerDay: 60, availability: 'Available', imageId: 'car5' },
  { id: '6', name: 'All-Terrain SUV', type: 'SUV', pricePerDay: 125, availability: 'Available', imageId: 'car6' },
  { id: '7', name: 'Eco-Friendly Sedan', type: 'Sedan', pricePerDay: 75, availability: 'Available', imageId: 'car7' },
  { id: '8', name: 'Luxury SUV', type: 'SUV', pricePerDay: 200, availability: 'Available', imageId: 'car8' },
  { id: '9', name: 'Workhorse Truck', type: 'Truck', pricePerDay: 160, availability: 'Available', imageId: 'car9' },
];

export const carTypes = ['Sedan', 'SUV', 'Truck', 'Van'];
