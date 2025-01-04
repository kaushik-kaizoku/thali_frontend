import Image from "next/image";
import RestaurantBooking  from "./_components/bookingform";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <RestaurantBooking />
    </div>
  );
}
