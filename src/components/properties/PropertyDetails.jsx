"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  Phone,
  Mail,
  StepBack,
  Home,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";
import Loader from "../common/Loader";
import { useTranslation } from "react-i18next";

export default function PropertyDetails({ property, user }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [myLease, setMyLease] = useState(false);

  if (!property) {
    return <Loader />;
  }

  const {
    _id: id,
    title,
    price,
    pricePeriod,
    type,
    address,
    description,
    listingType,
    bedrooms,
    bathrooms,
    area,
    images = [],
    owner,
  } = property;

  /* ---------------- LEASE CHECK ---------------- */
  useEffect(() => {
    if (!user) return;

    const fetchLease = async () => {
      const res = await leaseService.getMyLeases({
        role: "tenant",
      });
      const lease = res.data?.data?.find(
        (l) =>
          l.property?._id === id &&
          l.status !== "cancelled"
      );
      setMyLease(!!lease);
    };

    fetchLease();
  }, [id, user]);

  /* ---------------- REQUEST HANDLER ---------------- */
  const requestHandler = async () => {
    if (!user) {
      router.push("/pages/login");
      return;
    }

    try {
      const payload = {
        property: property._id,
        tenant: user._id,
        landlord: owner._id,
      };

      const res = await leaseService.createLease(
        payload
      );

      if (res.data?.success) {
        toast.success(t("requestSent"));
      } else {
        toast.error(
          res?.data?.message || t("requestFailed")
        );
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          t("requestFailed")
      );
    }
  };

  /* ---------------- AGENT ---------------- */
  const agent = {
    name: owner?.name || t("notAssigned"),
    phone: owner?.phone || "N/A",
    email: owner?.email || "N/A",
    image:
      owner?.avatar || "/agent-placeholder.png",
  };

  const gallery =
    images.length > 0
      ? images.map((img) => img.url).filter(Boolean)
      : ["/placeholder.jpg"];

  /* ---------------- SLIDER ---------------- */
  const [thumbIndex, setThumbIndex] =
    useState(0);
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const thumbNext = () =>
    setThumbIndex((prev) =>
      Math.min(prev + 1, gallery.length - 4)
    );
  const thumbPrev = () =>
    setThumbIndex((prev) =>
      Math.max(prev - 1, 0)
    );

  /* ---------------- BUTTON LOGIC ---------------- */
  const isLoggedIn = !!user;
  const isTenant = user?.role === "tenant";
  const hasLease = myLease;

  let buttonText = "";
  if (!isLoggedIn) {
    buttonText = t("loginToRequest");
  } else if (!user?.verified) {
    buttonText = t("verifyAccount");
  } else if (hasLease) {
    buttonText = t("requested");
  } else if (listingType === "rent") {
    buttonText = t("requestToRent");
  } else {
    buttonText = t("requestToBuy");
  }

  const isButtonDisabled =
    !isLoggedIn ||
    !user?.verified ||
    !isTenant ||
    hasLease;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* IMAGE */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-md bg-gray-100">
          <Image
            src={gallery[currentIndex]}
            alt={title}
            fill
            className="object-cover transition-all duration-300"
          />
        </div>

        {/* DETAILS */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1F2328]">
              {title}
            </h1>
            <p className="mt-3 text-[#004087] text-2xl md:text-3xl font-semibold">
              ${price}{" "}
              {listingType === "rent" &&
              pricePeriod
                ? `/${pricePeriod}`
                : t("oneTime")}
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={20} />
            <span>{address}</span>
          </div>

          {/* ACTION BUTTON */}
          <button
            disabled={isButtonDisabled}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              hasLease || !user?.verified
                ? "bg-gray-400 text-white cursor-not-allowed"
                : !isLoggedIn
                ? "bg-[#014087] hover:bg-[#014087]/90 text-white"
                : isTenant
                ? "bg-[#004087] hover:bg-[#003366] text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/pages/login");
              } else if (isTenant && !hasLease) {
                requestHandler();
              }
            }}
          >
            {buttonText}
            {!isLoggedIn &&
              !hasLease &&
              ` (${t("loginRequired")})`}
            {isLoggedIn &&
              !isTenant &&
              !hasLease &&
              ` (${t("tenantsOnly")})`}
            {hasLease &&
              ` (${t("alreadyRequested")})`}
          </button>

          {/* KEY DETAILS */}
          <div className="bg-white border rounded-xl p-5 md:p-6 shadow-sm">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">
              {t("keyDetails")}
            </h2>

            <div className="grid grid-cols-2 gap-5 text-gray-700">
              <Detail
                icon={<BedDouble size={24} />}
                value={bedrooms}
                label={t("bedrooms")}
              />
              <Detail
                icon={<Bath size={24} />}
                value={bathrooms}
                label={t("bathrooms")}
              />
              <Detail
                icon={<Square size={24} />}
                value={`${area} sqft`}
                label={t("area")}
              />
              <Detail
                icon={<Home size={24} />}
                value={type}
                label={t("type")}
              />
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="relative mt-4 py-2 px-2 bg-white/40 backdrop-blur-sm rounded-xl border shadow-sm select-none">
            <button
              onClick={thumbPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md border"
            >
              <StepBack className="w-4 h-4" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex gap-4 p-3 transition-transform duration-300"
                style={{
                  transform: `translateX(-${
                    thumbIndex * 100
                  }px)`,
                }}
              >
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setCurrentIndex(i)
                    }
                    className={`min-w-[95px] h-24 rounded-xl overflow-hidden border ${
                      currentIndex === i
                        ? "ring-2 ring-[#004087]"
                        : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumb ${i}`}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={thumbNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md border"
            >
              <StepBack className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">
          {t("description")}
        </h2>
        <p className="text-gray-700">
          {description}
        </p>
      </div>

      {/* CONTACT AGENT */}
      <div className="bg-white border rounded-xl p-5 md:p-7 shadow-sm">
        <h2 className="text-2xl font-semibold mb-5">
          {t("contactAgent")}
        </h2>

        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          <Image
            src={agent.image}
            alt="Agent"
            width={90}
            height={90}
            className="rounded-full object-cover shadow"
          />

          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              {agent.name}
            </h3>

            <div className="flex items-center gap-3 mt-2">
              <Phone size={18} />
              <span>{agent.phone}</span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <Mail size={18} />
              <span>{agent.email}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- DETAIL ITEM ---------- */
function Detail({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="font-semibold">{value}</p>
        <p className="text-sm text-gray-500">
          {label}
        </p>
      </div>
    </div>
  );
}
