"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-5 py-16 space-y-24">
      {/* HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2328] leading-tight">
            {t("about.heroTitle")}{" "}
            <span className="text-[#004087]">Casa Viva</span>
          </h1>

          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            {t("about.heroText1")}
            <br />
            <br />
            {t("about.heroText2")}
            <br />
            <br />
            {t("about.heroText3")}
            <br />
            <br />
            {t("about.heroText4")}
          </p>
        </div>

        <div className="relative w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/about.png"
            alt="About Us"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* MISSION & VISION */}
      <div className="grid md:grid-cols-2 gap-10">
        {[
          {
            title: t("about.missionTitle"),
            text: t("about.missionText"),
          },
          {
            title: t("about.visionTitle"),
            text: t("about.visionText"),
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-[#FFEDEB] to-[#FFF3F1] border rounded-3xl p-8 shadow-lg hover:shadow-2xl transition"
          >
            <h2 className="text-2xl font-semibold text-[#1F2328]">
              {item.title}
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      {/* OUR VALUES */}
      <div>
        <h2 className="text-3xl font-semibold text-[#1F2328] text-center mb-10">
          {t("about.coreValues")}
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: t("about.values.trustTitle"),
              text: t("about.values.trustText"),
            },
            {
              title: t("about.values.customerTitle"),
              text: t("about.values.customerText"),
            },
            {
              title: t("about.values.innovationTitle"),
              text: t("about.values.innovationText"),
            },
            {
              title: t("about.values.integrityTitle"),
              text: t("about.values.integrityText"),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 duration-300"
            >
              <h3 className="text-lg font-semibold text-[#1F2328]">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="bg-gradient-to-r from-[#FFF5F3] to-[#FFE9E5] border rounded-3xl p-10">
        <h2 className="text-3xl font-semibold text-[#1F2328] mb-8 text-center">
          {t("about.whyChooseUs")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: t("about.choose.expertTitle"),
              text: t("about.choose.expertText"),
            },
            {
              title: t("about.choose.verifiedTitle"),
              text: t("about.choose.verifiedText"),
            },
            {
              title: t("about.choose.seamlessTitle"),
              text: t("about.choose.seamlessText"),
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition hover:scale-105 duration-300 text-center"
            >
              <h3 className="text-xl font-semibold text-[#1F2328]">
                {item.title}
              </h3>
              <p className="mt-3 text-gray-600 text-sm">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TEAM SECTION */}
      <div>
        <h2 className="text-3xl font-semibold text-[#1F2328] text-center mb-10">
          {t("about.teamTitle")}
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {[
            {
              img: "/images/man.avif",
              name: "Johnathan Miller",
              role: t("about.teamRoles.consultant"),
            },
            {
              img: "/images/girl.jpg",
              name: "Sophia Rodriguez",
              role: t("about.teamRoles.manager"),
            },
            {
              img: "/images/miller.png",
              name: "Carlos Ramirez",
              role: t("about.teamRoles.investment"),
            },
          ].map((member, i) => (
            <div key={i} className="text-center">
              <div className="w-36 h-36 mx-auto rounded-full overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={144}
                  height={144}
                  className="object-cover"
                />
              </div>

              <h3 className="mt-4 text-xl font-semibold text-[#1F2328]">
                {member.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid sm:grid-cols-3 gap-10 text-center">
        {[
          {
            label: t("about.stats.properties"),
            value: "450+",
          },
          {
            label: t("about.stats.clients"),
            value: "900+",
          },
          {
            label: t("about.stats.experience"),
            value: "10+",
          },
        ].map((stat, i) => (
          <div key={i}>
            <p className="text-4xl font-bold text-[#E63946]">
              {stat.value}
            </p>
            <p className="text-gray-600 mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
