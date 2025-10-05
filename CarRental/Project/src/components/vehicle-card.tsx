
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CarFront, Car, Truck, Caravan, Zap } from 'lucide-react';
import type { Vehicle, Booking } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, addDocumentNonBlocking, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query, where } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Calendar } from '@/components/ui/calendar';
import React, { useState, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export function VehicleCard({ vehicle, imageData }: VehicleCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const VehicleIcon = typeIcons[vehicle.type] || Car;
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnTime, setReturnTime] = useState('17:00');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore || !isDialogOpen) return null;
    return query(collection(firestore, 'bookings'), where('vehicleId', '==', vehicle.id));
  }, [firestore, vehicle.id, isDialogOpen]);

  const { data: bookings } = useCollection<Booking>(bookingsQuery);

  const bookedDates = useMemo(() => {
    if (!bookings) return [];
    const dates: Date[] = [];
    bookings.forEach(booking => {
      if (booking.pickupDateTime && booking.returnDateTime) {
        let currentDate = (booking.pickupDateTime as any).toDate();
        const endDate = (booking.returnDateTime as any).toDate();
        // Set to midnight to compare dates only
        currentDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
    return dates;
  }, [bookings]);


  const handleBooking = async () => {
    if (!user) {
      // This should ideally not be hit if the button logic is correct, but serves as a safeguard.
      router.push('/login');
      return;
    }
    if (!firestore || !selectedDate || !pickupTime || !returnTime) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Please select a date and times.",
      });
      return;
    }
    
    const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
    const pickupDateTime = new Date(selectedDate);
    pickupDateTime.setHours(pickupHour, pickupMinute, 0, 0);

    const [returnHour, returnMinute] = returnTime.split(':').map(Number);
    const returnDateTime = new Date(selectedDate);
    returnDateTime.setHours(returnHour, returnMinute, 0, 0);

    if (returnDateTime <= pickupDateTime) {
       toast({
        variant: "destructive",
        title: "Invalid Time",
        description: "Return time must be after pickup time.",
      });
      return;
    }

    const newBooking = {
      userId: user.uid,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      pickupDateTime: pickupDateTime,
      returnDateTime: returnDateTime,
      totalPrice: vehicle.pricePerDay,
      bookingDate: serverTimestamp(),
      status: 'Upcoming'
    };

    try {
      const bookingsCol = collection(firestore, 'bookings');
      await addDocumentNonBlocking(bookingsCol, newBooking);
      
      toast({
        title: "Booking Successful!",
        description: `You've booked the ${vehicle.name} for ${format(pickupDateTime, 'PPP p')}.`,
      });

      router.push('/bookings');
      setIsDialogOpen(false);
      setSelectedDate(undefined);

    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Could not create your booking. Please try again.",
      });
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (user) {
      setIsDialogOpen(open);
      if (!open) {
        setSelectedDate(undefined);
      }
    } else {
        router.push('/login');
    }
  };
  
  const BookButton = () => {
    if (user) {
        return (
            <DialogTrigger asChild>
                <Button>Book</Button>
            </DialogTrigger>
        )
    }
    return (
        <Button asChild>
            <Link href="/login">Book</Link>
        </Button>
    )
  }

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
                "absolute top-3 right-3 text-xs",
                vehicle.availability.status === 'Available' 
                    ? 'bg-accent text-accent-foreground' 
                    : 'bg-secondary text-secondary-foreground'
            )}
           >
            {vehicle.availability.status === 'Available' ? <Zap className="w-3 h-3 mr-1" /> : null}
            {vehicle.availability.status === 'Rented' 
              ? `Rented until ${format(vehicle.availability.until, 'PP')}`
              : 'Available'
            }
           </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 text-lg font-semibold">{vehicle.name}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <VehicleIcon className="mr-2 h-4 w-4" />
          <span>{vehicle.type}</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0 bg-background/50">
        <div>
          <span className="text-xl font-bold">${vehicle.pricePerDay}</span>
          <span className="text-sm text-muted-foreground">/day</span>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <BookButton />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Book: {vehicle.name}</DialogTitle>
              <DialogDescription>
                Select an available day and time to book this vehicle. Shaded dates are already booked.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center">
               <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={[...bookedDates, { before: new Date() }]}
                className="rounded-md border"
              />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pickup-time">Pickup Time</Label>
                  <Select value={pickupTime} onValueChange={setPickupTime}>
                    <SelectTrigger id="pickup-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={`pickup-${time}`} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="return-time">Return Time</Label>
                  <Select value={returnTime} onValueChange={setReturnTime}>
                    <SelectTrigger id="return-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={`return-${time}`} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            <DialogFooter className="sm:justify-between">
               <DialogClose asChild>
                 <Button type="button" variant="secondary">
                  Cancel
                </Button>
               </DialogClose>
               <Button onClick={handleBooking} disabled={!selectedDate}>
                Confirm Booking for {selectedDate ? format(selectedDate, 'PPP') : '...'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
