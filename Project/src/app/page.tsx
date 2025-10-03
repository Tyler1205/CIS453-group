
'use client';

import { VehicleSearchForm } from '@/components/vehicle-search-form';
import { VehicleCard } from '@/components/vehicle-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Vehicle, Booking } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import { vehicles as staticVehicles } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

export default function Home() {
  const imageMap = new Map(PlaceHolderImages.map(img => [img.id, img]));
  const firestore = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    const now = new Date();
    return query(
      collection(firestore, 'bookings'),
      where('status', '==', 'Upcoming')
    );
  }, [firestore]);

  const { data: bookings, isLoading: bookingsLoading } = useCollection<Booking>(bookingsQuery);

  const vehiclesWithAvailability = useMemo(() => {
    if (!bookings) {
      return staticVehicles.map(v => ({ ...v, availability: { status: 'Available' } as const }));
    }

    const rentedVehicleInfo = new Map<string, Date>();
    bookings.forEach(b => {
        if (!b.returnDateTime) return;
        const returnDate = (b.returnDateTime as any).toDate();
        if (returnDate >= new Date()) {
            const existingReturnDate = rentedVehicleInfo.get(b.vehicleId);
            if (!existingReturnDate || returnDate > existingReturnDate) {
                rentedVehicleInfo.set(b.vehicleId, returnDate);
            }
        }
    });

    return staticVehicles.map(vehicle => {
      if (rentedVehicleInfo.has(vehicle.id)) {
        return {
          ...vehicle,
          availability: { status: 'Rented' as const, until: rentedVehicleInfo.get(vehicle.id)! },
        };
      }
      return {
        ...vehicle,
        availability: { status: 'Available' as const },
      };
    });
  }, [bookings]);

  const isLoading = bookingsLoading;

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <section className="mb-12 rounded-lg bg-card p-6 shadow-lg md:p-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Find Your Perfect Rental Car
        </h1>
        <p className="mb-6 text-muted-foreground">
          Search for cars by location, date, and type.
        </p>
        <VehicleSearchForm />
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold tracking-tight">
          Available Vehicles
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          ) : (
            vehiclesWithAvailability.map((vehicle) => {
              const imageData = imageMap.get(vehicle.imageId);
              return (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  imageData={imageData}
                />
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[225px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    </div>
  )
}
