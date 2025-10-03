
'use client';

import { VehicleSearchForm } from '@/components/vehicle-search-form';
import { VehicleCard } from '@/components/vehicle-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Vehicle } from '@/lib/types';
import { vehicles as staticVehicles } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/firebase';

export default function Home() {
  const imageMap = new Map(PlaceHolderImages.map(img => [img.id, img]));
  const { isUserLoading } = useUser();

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
          {isUserLoading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))
          ) : (
            staticVehicles.map((vehicle) => {
              const imageData = imageMap.get(vehicle.imageId);
              return (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={{...vehicle, availability: { status: 'Available' }}}
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
