'use client';

import React from "react";
import Header from '../app/components/Header';
import HeroSection from '../app/components/Hero';
import Footer from '../app/components/Footer';
import CoreMethodology from "../app/components/CoreMethodology";
import ContactUs from "../app/components/ContactUs";
import OurProcess from "../app/components/OurProcess";
import OurCore from "../app/components/OurCore";
import Pricing from "../app/components/Pricing";
import Service from "../app/components/Service";

export default function HomePage() {
  return (
    <>
      {/* Header */}
      <Header />

      {/* Homepage */}
      <main>

        {/* Hero - first section user sees */}
        <HeroSection />

        {/* Our Core Section */}
        <OurCore />

        {/* Core Methodology Section */
        <CoreMethodology />}

        {/* Pricing Section */
        <Pricing />}

        {/* Service Section */}
        <Service />

        {/* Our Process Section */}
        <OurProcess />

        {/* Contact Us Section */}
        <ContactUs />
        
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
}