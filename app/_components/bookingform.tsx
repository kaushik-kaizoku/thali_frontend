"use client";
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE_URL = 'http://localhost:3000/api';

const RestaurantBooking = () => {
  const [step, setStep] = useState(1);
  const [guests, setGuests] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchTimeSlots = async (guestCount: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/timeslots?guests=${guestCount}`);
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const data = await response.json();
      setTimeSlots(data);
    } catch (err) {
      setError('Error fetching available times. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const makeReservation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          guests: parseInt(guests),
          timeSlot: selectedTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to make reservation');
      
      const data = await response.json();
      setSuccess(true);
    } catch (err) {
      setError('Error making reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (guests && parseInt(guests) > 0) {
      fetchTimeSlots(guests);
      setStep(2);
    } else {
      setError('Please enter a valid number of guests');
    }
  };

  const handleTimeSelection = (time: React.SetStateAction<string>) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleFinalSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (name && phone) {
      await makeReservation();
      setStep(4);
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Restaurant Reservation</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <form onSubmit={handleGuestSubmit}>
            <div className="space-y-4">
              <label className="block">
                Number of Guests
                <Input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="mt-1"
                  placeholder="Enter number of guests"
                />
              </label>
              <Button type="submit" className="w-full">
                Find Available Times
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select a Time</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <Button
                  key={slot.time}
                  onClick={() => slot.available && handleTimeSelection(slot.time)}
                  disabled={!slot.available}
                  variant={slot.available ? "outline" : "ghost"}
                  className={`p-4 ${
                    !slot.available && "bg-gray-100 text-gray-400"
                  }`}
                >
                  {slot.time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div>
              <label className="block">
                Name
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your name"
                />
              </label>
            </div>
            <div>
              <label className="block">
                Phone Number
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your phone number"
                />
              </label>
            </div>
            <Button type="submit" className="w-full">
              Complete Reservation
            </Button>
          </form>
        )}

        {step === 4 && success && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-green-600">
              Reservation Confirmed!
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Reservation Details:</h4>
              <p>Name: {name}</p>
              <p>Number of Guests: {guests}</p>
              <p>Time: {selectedTime}</p>
              <p>Phone: {phone}</p>
            </div>
            <Button
              onClick={() => {
                setStep(1);
                setSuccess(false);
                setSelectedTime('');
                setName('');
                setPhone('');
                setGuests('');
              }}
              className="w-full"
            >
              Make Another Reservation
            </Button>
          </div>
        )}

        {loading && <p className="text-center">Loading...</p>}
      </CardContent>
    </Card>
  );
};

export default RestaurantBooking;