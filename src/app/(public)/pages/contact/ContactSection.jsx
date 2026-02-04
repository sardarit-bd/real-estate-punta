"use client";

import { motion } from "framer-motion";
import { PhoneCall, Mail, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactSection() {
  const { t } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

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
            {t("contactSection.title")}
          </motion.h2>

          <p className="text-[#6F6F6F] mt-4 max-w-2xl mx-auto text-sm md:text-base">
            {t("contactSection.subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Phone */}
            <motion.div whileHover={{ y: -4 }} className="card">
              <PhoneCall size={40} className="icon" />
              <div>
                <h3 className="card-title">
                  {t("contactSection.phone.title")}
                </h3>
                <p className="card-desc">
                  {t("contactSection.phone.desc")}
                </p>
                <a href="tel:+1800123456" className="card-link">
                  +1 800 123 456
                </a>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div whileHover={{ y: -4 }} className="card">
              <Mail size={40} className="icon" />
              <div>
                <h3 className="card-title">
                  {t("contactSection.email.title")}
                </h3>
                <p className="card-desc">
                  {t("contactSection.email.desc")}
                </p>
                <a
                  href="mailto:info@realestate.com"
                  className="card-link"
                >
                  info@realestate.com
                </a>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div whileHover={{ y: -4 }} className="card">
              <MapPin size={40} className="icon" />
              <div>
                <h3 className="card-title">
                  {t("contactSection.location.title")}
                </h3>
                <p className="card-desc">
                  {t("contactSection.location.desc")}
                </p>
                <p className="text-[#113B28] text-sm font-medium">
                  {t("contactSection.location.address")}
                </p>
                <div className="flex items-center gap-2 text-[#6F6F6F] text-sm mt-1">
                  <Clock size={14} />
                  <span>{t("contactSection.location.hours")}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: FORM */}
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              alert(t("contactSection.form.success"));
            }}
          >
            <h3 className="text-xl font-semibold text-[#113B28] mb-4">
              {t("contactSection.form.title")}
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder={t("contactSection.form.name")}
                required
                className="input-field"
              />
              <input
                type="email"
                placeholder={t("contactSection.form.email")}
                required
                className="input-field"
              />
            </div>

            <input
              type="tel"
              placeholder={t("contactSection.form.phone")}
              required
              className="input-field"
            />

            <textarea
              placeholder={t("contactSection.form.message")}
              rows={4}
              className="input-field resize-none"
            />

            <button type="submit" className="submit-btn">
              {t("contactSection.form.button")}
            </button>
          </motion.form>
        </div>
      </div>

      {/* styles */}
      <style>{`
        .card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          display: flex;
          gap: 16px;
        }
        .icon { color: #004087; }
        .card-title { font-weight: 600; font-size: 18px; color: #113B28; }
        .card-desc { color: #6F6F6F; font-size: 14px; margin-bottom: 6px; }
        .card-link { color: #113B28; font-weight: 600; }
        .submit-btn {
          width: 100%;
          background: #004087;
          color: white;
          padding: 12px;
          border-radius: 12px;
          font-weight: 600;
        }
        .submit-btn:hover { background: #002b5c; }
        .input-field {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 1px solid #ddd;
        }
      `}</style>
    </section>
  );
}
