export const citiesData = [
  {
    name: "New York",
    slug: "new-york",
    img: "/images/1.jpg",
    description:
      "New York is one of the world’s most vibrant real estate markets, offering luxury apartments and premium investment opportunities.",
    highlights: [
      "Luxury high-rise apartments",
      "Strong Investment Return",
      "Top-rated schools",
      "Premium nightlife",
    ],



    properties: [
      {
        id: 1,
        title: "Luxury Apartment in Manhattan",
        price: 350000,
        beds: 2,
        baths: 2,
        size: "1500 sq ft",
        image: "/images/properties/ny-1.png",
      },
      {
        id: 2,
        title: "Modern Studio Near Central Park",
        price: 180000,
        beds: 1,
        baths: 1,
        size: "700 sq ft",
        image: "/images/properties/ny-2.png",
      },
      {
        id: 3,
        title: "Penthouse with Skyline View",
        price: 950000,
        beds: 3,
        baths: 3,
        size: "2800 sq ft",
        image: "/images/properties/ny-3.png",
      },
      {
        id: 4,
        title: "Manhattan Elite Condo",
        price: 550000,
        beds: 2,
        baths: 2,
        size: "1600 sq ft",
        image: "/images/properties/ny-4.png",
      },
      {
        id: 5,
        title: "Luxury Townhome in Queens",
        price: 420000,
        beds: 3,
        baths: 2,
        size: "2000 sq ft",
        image: "/images/properties/ny-5.png",
      },
      {
        id: 6,
        title: "High Rise Apartment",
        price: 310000,
        beds: 2,
        baths: 1,
        size: "1300 sq ft",
        image: "/images/properties/ny-6.png",
      },
      {
        id: 7,
        title: "Luxury condo with balcony",
        price: 480000,
        beds: 2,
        baths: 2,
        size: "1400 sq ft",
        image: "/images/properties/ny-7.png",
      },
      {
        id: 8,
        title: "Downtown Premium Apartment",
        price: 600000,
        beds: 3,
        baths: 2,
        size: "1800 sq ft",
        image: "/images/properties/ny-8.png",
      },
      {
        id: 9,
        title: "Modern Residential Condo",
        price: 270000,
        beds: 1,
        baths: 1,
        size: "900 sq ft",
        image: "/images/properties/ny-9.png",
      },
      {
        id: 10,
        title: "New York Luxury Villa",
        price: 1250000,
        beds: 4,
        baths: 3,
        size: "3500 sq ft",
        image: "/images/properties/ny-10.png",
      },
    ],
  },

  /* ==== SAME FORMAT FOR OTHER CITIES ==== */

  {
    name: "San Diego",
    slug: "san-diego",
    img: "/images/2.png",
    description:
      "San Diego offers calm beaches, peaceful neighborhoods, and a growing investment market.",
    highlights: ["Family-friendly", "Beach city", "Affordable rentals"],
    gallery: ["/images/cities/sd-1.jpg", "/images/cities/sd-2.jpg"],

    properties: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Beautiful Home in San Diego #${i + 1}`,
      price: 200000 + i * 15000,
      beds: 2,
      baths: 2,
      size: `${1200 + i * 50} sq ft`,
      image: `/images/properties/ny-${i + 1}.png`,
    })),
  },

  {
    name: "Miami",
    slug: "miami",
    img: "/images/3.jpg",
    description:
      "Miami is famous for beachfront condos, luxury villas, and high rental demand.",
    highlights: ["Beachfront views", "Luxury lifestyle", "High rental demand"],
    // gallery: [
    //   "/images/cities/miami-1.jpg",
    //   "/images/cities/miami-2.jpg",
    //   "/images/cities/miami-3.jpg",
    // ],

    properties: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Miami Luxury Villa #${i + 1}`,
      price: 300000 + i * 20000,
      beds: 3,
      baths: 2,
      size: `${1400 + i * 60} sq ft`,
      image: `/images/properties/ny-${i + 1}.png`,
    })),
  },

  {
    name: "Los Angeles",
    slug: "los-angeles",
    img: "/images/4.jpg",
    description:
      "Los Angeles offers high-end villas, celebrity homes, and premium hillside properties.",
    highlights: ["Celebrity homes", "Hillside villas", "Luxury rentals"],

    gallery: ["/images/cities/la-1.jpg", "/images/cities/la-2.jpg"],

    properties: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `LA Modern Home #${i + 1}`,
      price: 500000 + i * 30000,
      beds: 3,
      baths: 3,
      size: `${2000 + i * 70} sq ft`,
      image: `/images/properties/ny-${i + 1}.png`,
    })),
  },

  {
    name: "Chicago",
    slug: "chicago",
    img: "/images/5.jpg",
    description:
      "Chicago includes affordable apartments, commercial real estate, and urban living.",
    highlights: ["Affordable", "Urban lifestyle", "Commercial buildings"],
    gallery: ["/images/cities/chicago-1.jpg", "/images/cities/chicago-2.jpg"],

    properties: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Chicago Apartment #${i + 1}`,
      price: 150000 + i * 10000,
      beds: 2,
      baths: 1,
      size: `${1100 + i * 50} sq ft`,
      image: `/images/properties/ny-${i + 1}.png`,
    })),
  },
];
