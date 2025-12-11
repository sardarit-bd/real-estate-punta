"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="py-16 md:py-24 bg-[#FFF6F2]">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT TEXT */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#113B28]"
          >
            Get in Touch With <span className="text-[#004087]">Our Real Estate Team</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-5 text-[#6F6F6F] text-base leading-relaxed max-w-md"
          >
            Whether you are looking to buy, sell, or invest in Punta Cana properties, 
            our experienced team is ready to guide you every step of the way.  
            Contact us for expert advice, property tours, and personalized support.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8"
          >
            {/* <a
              href="#contact-form"
              className="inline-block bg-[#E7C464] text-[#113B28] px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-[#d7b356] transition"
            >
              Contact Us Now
            </a> */}
          </motion.div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-lg border border-white">
            <Image
              src="/images/contact.jpg"   
              alt="Punta Cana Property"
              width={700}
              height={450}
              className="object-cover w-full h-[320px] md:h-[380px]"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
