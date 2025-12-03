"use client";

import { motion } from "framer-motion";
import { PhoneCall, Mail, MapPin, Clock } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="relative py-20 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 md:px-0 relative z-10">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <motion.h2
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-[#113B28]"
          >
            Get In Touch
          </motion.h2>

          <p className="text-[#6F6F6F] mt-4 max-w-2xl mx-auto text-sm md:text-base">
            Have questions about properties, investment advice, or scheduling a property tour?
            Our team is ready to assist you anytime.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* LEFT: Contact Info */}
          <div className="space-y-6">

            {/* Phone */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 
              flex items-start gap-4 transition"
            >
              <PhoneCall size={40} className="text-[#E7C464]" />
              <div>
                <h3 className="font-semibold text-lg text-[#113B28]">
                  Call Us Anytime
                </h3>
                <p className="text-[#6F6F6F] text-sm mb-2">
                  For property visits & investment guidance
                </p>
                <a
                  href="tel:+1800123456"
                  className="text-[#113B28] font-semibold hover:underline text-lg"
                >
                  +1 800 123 456
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 
              flex items-start gap-4 transition"
            >
              <Mail size={40} className="text-[#E7C464]" />
              <div>
                <h3 className="font-semibold text-lg text-[#113B28]">
                  Email Support
                </h3>
                <p className="text-[#6F6F6F] text-sm mb-2">
                  Get quick responses within 12–24 hours
                </p>
                <a
                  href="mailto:info@realestate.com"
                  className="text-[#113B28] font-semibold hover:underline"
                >
                  info@realestate.com
                </a>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              whileHover={{ y: -4 }}
              className="bg-white shadow-md rounded-2xl p-6 border border-gray-200 
              flex items-start gap-4 transition"
            >
              <MapPin size={40} className="text-[#E7C464]" />
              <div>
                <h3 className="font-semibold text-lg text-[#113B28]">
                  Visit Our Office
                </h3>
                <p className="text-[#6F6F6F] text-sm mb-2">
                  Come meet our real-estate specialists
                </p>
                <p className="text-[#113B28] text-sm font-medium">
                  Punta Cana, Dominican Republic
                </p>
                <div className="flex items-center gap-2 text-[#6F6F6F] text-sm mt-1">
                  <Clock size={14} />
                  <span>Mon–Sat, 9:00 AM – 7:00 PM</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Contact Form */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent! We will contact you shortly.");
            }}
          >
            <h3 className="text-xl font-semibold text-[#113B28] mb-4">
              Send Us a Message
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Full Name"
                required
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="input-field"
              />
            </div>

            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="input-field"
            />

            <textarea
              placeholder="Your Message"
              rows={4}
              className="input-field resize-none"
            />

            <button
              type="submit"
              className="w-full bg-[#E7C464] text-[#113B28] py-3 rounded-xl font-semibold
              shadow-md hover:bg-[#d7b356] transition"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </div>

      {/* INPUT FIELD STYLES */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #ddd;
          background: #FFF;
          font-size: 14px;
          color: #113B28;
          outline: none;
          transition: 0.2s;
        }
        .input-field:focus {
          border-color: #E7C464;
          box-shadow: 0 0 0 3px rgba(231,196,100,0.25);
        }
      `}</style>
    </section>
  );
}
