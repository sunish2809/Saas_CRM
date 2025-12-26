"use client";
import { AnimatedTooltip } from "../components/ui/animated-tooltip";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
const people = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    image:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3387&q=80",
  },
  {
    id: 2,
    name: "Robert Johnson",
    designation: "Gym Owner",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Jane Smith",
    designation: "Inventory Manager",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Emily Davis",
    designation: "Business Owner",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Tyler Durden",
    designation: "Library Owner",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3540&q=80",
  }

];

const Hero = () => {
  const navigate = useNavigate()
  const handleScroll =(e:any)=>{
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);

    target.scrollIntoView({
      behavior: 'smooth'
    });
  }
  return (

    <>
    <Navbar/>
    <section
      id="hero"
      className="bg-neutral-900  w-full z-50 bg-cover bg-center bg-no-repeat  min-h-[70vh] pt-20 h-screen bg-[url('https://mydukaan.io/_next/static/media/banner-home-main.ebd707dd321420dd97b2e08e0aa39020.webp')]"
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero content */}

          <div className="text-center lg:text-left animate__animated animate__fadeInLeft">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
              Streamline Your Business
              <br></br>
              Operations
            </h1>
            <div className="text-black font-normal mb-10">
              Choose from our suite of specialized management systems.
              <br></br>
              One platform, endless possibilities.
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={()=>navigate('/get-started')} className="bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg transition-all text-lg font-semibold animate__animated animate__fadeInUp shadow-lg">
                Get Started
              </button>
 
              <a href="#solutions" onClick={handleScroll} className="border-2 border-slate-700 text-slate-800 bg-white px-8 py-3 rounded-lg hover:bg-slate-50 hover:border-slate-800 transition-all text-lg font-semibold animate__animated animate__fadeInUp animate__delay-1s shadow-md">
                View Solutions
              </a>
              
              <button 
                onClick={() => navigate('/try-demo')} 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg transition-all text-lg font-semibold animate__animated animate__fadeInUp animate__delay-2s shadow-lg"
              >
                Try Demo
              </button>
            </div>
            <div className="mt-8 text-gray-400 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex flex-row  mb-10 ">
                <AnimatedTooltip items={people} />
              </div>
              <div className=" text-black mb-10 ml-2.5">
                Trusted by 1000+ businesses
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
    </>

  );
};

export default Hero;
