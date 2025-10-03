import Image from 'next/image';
import { CarFront, Car, Truck, Caravan, Zap } from 'lucide-react';
import type { Vehicle } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type VehicleCardProps = {
  vehicle: Vehicle;
  imageData?: ImagePlaceholder;
};

const typeIcons: Record<Vehicle['type'], React.ElementType> = {
  Sedan: CarFront,
  SUV: Car,
  Truck: Truck,
  Van: Caravan,
};

export function VehicleCard({ vehicle, imageData }: VehicleCardProps) {
  const Icon = typeIcons[vehicle.type];

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/10]">
          {imageData ? (
             <Image
                src={imageData.imageUrl}
                alt={imageData.description}
                fill
                className="object-cover"
                data-ai-hint={imageData.imageHint}
              />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
                <Car className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
           <Badge 
            className={cn(
                "absolute top-3 right-3",
                vehicle.availability === 'Available' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-secondary text-secondary-foreground'
            )}
           >
            {vehicle.availability === 'Available' ? <Zap className="w-3 h-3 mr-1" /> : null}
            {vehicle.availability}
           </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-lg font-semibold">{vehicle.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Icon className="mr-2 h-4 w-4" />
          <span>{vehicle.type}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0 bg-background/50">
        <div>
          <span className="text-xl font-bold">${vehicle.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Button disabled={vehicle.availability !== 'Available'}>Book Now</Button>
      </CardFooter>
    </Card>
  );
}
