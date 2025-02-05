import { useState, useEffect } from "react";
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      quote:
        "This apartment management system has simplified our housing society operations tremendously. From maintenance tracking to visitor management, everything is now at our fingertips!",
      name: "Rajesh Mehta",
      title: "Apartment Management System User",
    },
    {
      quote:
        "Our gym membership management became 10x easier after implementing this software. It handles attendance, payments, and workout schedules seamlessly!",
      name: "Priya Sharma",
      title: "Fitness Center Owner",
    },
    {
      quote:
        "The library management module has reduced our book tracking time by 60%. Automatic reminders for returns and digital cataloging are game-changers!",
      name: "Aarav Gupta",
      title: "Public Library Administrator",
    },
    {
      quote:
        "As a shop owner, the inventory management system has been revolutionary. Real-time stock alerts and supplier management features saved us countless hours!",
      name: "Ananya Patel",
      title: "Retail Store Manager",
    },
    {
      quote:
        "The facility booking system transformed how we manage our community hall. Online reservations and payment integration have eliminated all scheduling conflicts!",
      name: "Deepika Reddy",
      title: "Community Center Coordinator",
    },
    {
      quote:
        "Maintenance request tracking through this system has improved our response time by 80%. Tenants love the real-time updates and resolution tracking!",
      name: "Vikram Singh",
      title: "Property Management Executive",
    },
    {
      quote:
        "The employee management module streamlined our HR operations completely. From attendance to payroll, everything is now perfectly organized!",
      name: "Neha Joshi",
      title: "Corporate HR Manager",
    },
    {
      quote:
        "Our school's administrative tasks became effortless with the student management system. Fee collection, timetable management, and parent communication - all in one platform!",
      name: "Rohit Kumar",
      title: "School Principal",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      id="testimonials"
      className="h-[20rem] rounded-md flex flex-col antialiased bg-black dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"
    >
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
};

export default Testimonials;
