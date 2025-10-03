import { vehicles } from '@/lib/data';
import { VehicleSearchForm } from '@/components/vehicle-search-form';
import { VehicleCard } from '@/components/vehicle-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const imageMap = new Map(PlaceHolderImages.map(img => [img.id, img]));

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
          {vehicles.map((vehicle) => {
            const imageData = imageMap.get(vehicle.imageId);
            return (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                imageData={imageData}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
