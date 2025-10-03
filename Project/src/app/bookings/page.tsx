
'use client';

import { BookMarked, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useCollection, useUser, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from '@/firebase';
import type { Booking } from '@/lib/types';
import { collection, query, where, doc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function BookingsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const bookingsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'bookings');
  }, [firestore]);

  const { data: bookings, isLoading, error } = useCollection<Booking>(bookingsQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const { upcomingBookings, pastBookings } = useMemo(() => {
    if (!bookings) return { upcomingBookings: [], pastBookings: [] };

    const now = new Date();
    const allUserBookings = bookings.filter(b => b.userId === user?.uid);

    const upcoming = allUserBookings.filter(b => {
      return b.returnDateTime && (b.returnDateTime as any).toDate() >= now;
    });

    const past = allUserBookings.filter(b => {
      return !b.returnDateTime || (b.returnDateTime as any).toDate() < now;
    });

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [bookings, user]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!firestore) return;
    const bookingRef = doc(firestore, 'bookings', bookingId);
    try {
      await deleteDocumentNonBlocking(bookingRef);
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled.',
      });
    } catch(e) {
       toast({
        variant: 'destructive',
        title: 'Cancellation Failed',
        description: 'There was an error cancelling your booking.',
      });
    }
  };
  
  if (isUserLoading || !user) {
    return (
       <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <BookMarked className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="text-muted-foreground">View and manage your car rentals.</p>
          </div>
        </div>
         <div className="space-y-12">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle><Skeleton className="h-7 w-48"/></CardTitle>
                    <CardDescription><Skeleton className="h-5 w-80"/></CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full"/>
                </CardContent>
            </Card>
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle><Skeleton className="h-7 w-48"/></CardTitle>
                    <CardDescription><Skeleton className="h-5 w-80"/></CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full"/>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <BookMarked className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your car rentals.</p>
        </div>
      </div>

      {error && (
         <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error loading bookings</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Upcoming Rentals</CardTitle>
            <CardDescription>
              These are your upcoming car rental reservations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 2 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto"/></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto"/></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto"/></TableCell>
                  </TableRow>
                ))}
                {!isLoading && upcomingBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.vehicleName}</TableCell>
                    <TableCell>{booking.pickupDateTime ? format((booking.pickupDateTime as any).toDate(), 'PPP p') : 'N/A'}</TableCell>
                    <TableCell>{booking.returnDateTime ? format((booking.returnDateTime as any).toDate(), 'PPP p') : 'N/A'}</TableCell>
                    <TableCell className="text-right">${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">{booking.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Cancel Booking</span>
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently cancel your booking for the <strong>{booking.vehicleName}</strong>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Back</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && upcomingBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      You have no upcoming bookings.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Past Rentals</CardTitle>
            <CardDescription>
              A history of all your completed car rentals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && Array.from({ length: 1 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto"/></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto"/></TableCell>
                  </TableRow>
                ))}
                {!isLoading && pastBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.vehicleName}</TableCell>
                    <TableCell>{booking.pickupDateTime ? format((booking.pickupDateTime as any).toDate(), 'PPP p') : 'N/A'}</TableCell>
                    <TableCell>{booking.returnDateTime ? format((booking.returnDateTime as any).toDate(), 'PPP p') : 'N/A'}</TableCell>
                    <TableCell className="text-right">${booking.totalPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={booking.status === 'Completed' ? 'secondary' : 'outline'}>{booking.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && pastBookings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      You have no past bookings.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
