import { useState, useEffect } from 'react';
import { InfiniteMovingCards } from "../components/ui/infinite-moving-cards";

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // const testimonials = [
  //   {
  //     initials: "JD",
  //     name: "John Doe",
  //     role: "Library Manager",
  //     content: "The library management system has transformed how we operate. The automation features have saved us countless hours of manual work."
  //   },
  //   // Add other testimonials...
  // ];
  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote: "All that we see or seem is but a dream within a dream.",
      name: "Edgar Allan Poe",
      title: "A Dream Within a Dream",
    },
    {
      quote:
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      name: "Jane Austen",
      title: "Pride and Prejudice",
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    // <section id="testimonials" className="bg-white-900 py-20">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="text-center mb-16 animate__animated animate__fadeIn">
    //       <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
    //         Trusted by Business Leaders
    //       </h2>
    //       <p className="text-lg text-black-300 max-w-2xl mx-auto">
    //         See what our customers have to say about their experience
    //       </p>
    //     </div>

    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    //       {testimonials.map((testimonial, index) => (
    //         <div
    //           key={index}
    //           className={`bg-neutral-800 rounded-xl p-6 shadow-lg animate__animated animate__fadeInUp ${
    //             index === currentSlide ? 'block' : 'hidden'
    //           }`}
    //         >
    //           <div className="flex items-center mb-4">
    //             <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
    //               <span className="text-xl font-bold text-white">{testimonial.initials}</span>
    //             </div>
    //             <div className="ml-4">
    //               <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
    //               <p className="text-gray-400">{testimonial.role}</p>
    //             </div>
    //           </div>
    //           <div className="mb-4 text-yellow-400">★★★★★</div>
    //           <p className="text-gray-300">{testimonial.content}</p>
    //         </div>
    //       ))}
    //     </div>

    //     <div className="flex justify-center mt-8 space-x-2">
    //       {testimonials.map((_, index) => (
    //         <button
    //           key={index}
    //           onClick={() => setCurrentSlide(index)}
    //           className={`w-3 h-3 rounded-full transition-colors ${
    //             index === currentSlide ? 'bg-indigo-600' : 'bg-gray-600 hover:bg-indigo-600'
    //           }`}
    //         />
    //       ))}
    //     </div>
    //   </div>
    // </section>
    <div className="h-[20rem] rounded-md flex flex-col antialiased bg-black dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
};

export default Testimonials;