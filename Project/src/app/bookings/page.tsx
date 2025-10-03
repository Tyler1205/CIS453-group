import { BookMarked } from 'lucide-react';
import { bookings } from '@/lib/data';
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
import { format } from 'date-fns';

export default function BookingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <BookMarked className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">View and manage your car rentals.</p>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Upcoming & Past Rentals</CardTitle>
          <CardDescription>
            A list of your recent and upcoming bookings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Pickup Date</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead className="text-right">Total Price</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.vehicle.name}</TableCell>
                  <TableCell>{format(booking.pickupDate, 'PPP')}</TableCell>
                  <TableCell>{format(booking.returnDate, 'PPP')}</TableCell>
                  <TableCell className="text-right">${booking.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={new Date() > booking.returnDate ? 'secondary' : 'default'}>
                      {new Date() > booking.returnDate ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
               {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    You have no bookings yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
