
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import About from "./About";
import Services from "./Services";
import Gallery from "./Gallery";
import Testimonials from "./Testimonials";
import Team from "./Team";
import Contact from "./Contact";
import Footer from "./Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import Login from "./Login";
import Signup from "./Signup";

function Home() {
    useEffect(() => {
        document.documentElement.style.overflowY = "scroll"; // Allow scrolling
        document.documentElement.style.scrollbarWidth = "none"; // Hide scrollbar (for Firefox)
        document.documentElement.style.msOverflowStyle = "none"; // Hide scrollbar (for IE & Edge)
      }, []);
      
      
      const [isScrolled, setIsScrolled] = useState(false);
      const [activeForm, setActiveForm] = useState(null); // "login" | "signup" | null
    
      useEffect(() => {
        AOS.init({
          duration: 1000,
          once: true,
        });
      }, []);
    
      useEffect(() => {
        const handleScroll = () => {
          setIsScrolled(window.scrollY > 50);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
  return (
    <div className="overflow-hidden">
      <Navbar 
  isScrolled={isScrolled} 
  onLogin={() => setActiveForm("login")} 
  onSignup={() => setActiveForm("signup")} 
/>
      <Hero onLogin={() => setActiveForm("login")} />
      <Features />
      <About />
      <Services />
      <Gallery />
      <Testimonials />
      <Team />
      <Contact />
      <Footer />
      {activeForm === "login" && <Login onClose={() => setActiveForm(null)}  onSignup={() => setActiveForm("signup")} />}
      {activeForm === "signup" && <Signup onClose={() => setActiveForm(null)} Login={() => setActiveForm("login")}  />}
    </div>
  )
}

export default Home
