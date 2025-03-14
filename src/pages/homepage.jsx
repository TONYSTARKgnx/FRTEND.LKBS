import React from 'react'

import Navbar from '../components/navbar'
import HeroSection from '../components/herosection'
import FeaturedSection from '../components/featuredsection'
import AboutSection from '../components/aboutsection'
import ContactSection from '../components/contactsection'
import Footer from '../components/footer'
export default function HomePage() {
  return (
    <div >
      <Navbar />
      <div id="home"><HeroSection /></div>
      <div ><FeaturedSection /></div>
      <div id="about"><AboutSection /></div>
      <div id="contact"><ContactSection /></div>
      <Footer />
      
    </div>
  )
}
