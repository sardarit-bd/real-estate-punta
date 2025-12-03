
import React from 'react'
import GoogleMap from './GoogleMap'
import ContactSection from './ContactSection'
import ContactHero from './ContactHero'

export default function page() {
    return (
        <section className="pb-20">
            <ContactHero />
            <div className="container mx-auto px-6">
                <ContactSection />
                <GoogleMap />
            </div>
        </section>
    )
}