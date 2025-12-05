import { create } from "zustand";

const initialProperties = [
  {
    id: 1,
    image: "/uploads/abc.png",
    title: "Luxury Family Home",
    price: "395000",
    address: "1800-1818 79th St",
    beds: 4,
    baths: 1,
    sqft: 400,
    isFeatured: true,
    type: "sale",               // listing type
    propertyType: "Villa",      // NEW field
    city: "punta-cana",
    description:
      "A beautiful villa with stunning views and modern amenities.",
    agent: {
      name: "Ashiqur Rahman",
      phone: "(123) 456-7890",
      email: "R9yQ2@example.com55",
      image: "/uploads/agent.png",
    },
  },
  {
    id: 2,
    image: "/uploads/abcd.png",
    title: "Skyper Pool Apartment",
    price: "280000",
    address: "1020 Bloomingdale Ave",
    beds: 4,
    baths: 2,
    sqft: 450,
    isFeatured: false,
    type: "sale",
    propertyType: "Apartment",
    city: "bavaro",
    description:
      "Modern apartment with amazing pool view and premium amenities.",
    agent: {
      name: "Ashiqur Rahman",
      phone: "(123) 456-7890",
      email: "R9yQ2@example.com55",
      image: "/uploads/agent.png",
    },
  },
  {
    id: 3,
    image: "/uploads/abc.png",
    title: "North Dillard Street",
    price: "250",
    address: "4330 Bill Shoals Rd",
    beds: 4,
    baths: 2,
    sqft: 400,
    isFeatured: false,
    type: "rent",
    propertyType: "House",
    city: "cocotal",
    description:
      "A cozy rental house with beautiful surroundings and modern interiors.",
    agent: {
      name: "Ashiqur Rahman",
      phone: "(123) 456-7890",
      email: "R9yQ2@example.com55",
      image: "/uploads/agent.png",
    },
  },
  {
    id: 4,
    image: "/uploads/abcd.png",
    title: "Eaton Grant Penthouse",
    price: "180000",
    address: "7722 18th Ave, Brooklyn",
    beds: 4,
    baths: 2,
    sqft: 450,
    isFeatured: true,
    type: "sale",
    propertyType: "Penthouse",
    city: "cap-cana",
    description:
      "Premium penthouse located in a luxury neighborhood.",
    agent: {
      name: "Ashiqur Rahman",
      phone: "(123) 456-7890",
      email: "R9yQ2@example.com55",
      image: "/uploads/agent.png",
    },
  },
  {
    id: 5,
    image: "/uploads/abc.png",
    title: "New Apartment Nice View",
    price: "850",
    address: "42 Avenue O, Brooklyn",
    beds: 2,
    baths: 1,
    sqft: 460,
    isFeatured: true,
    type: "rent",
    propertyType: "Apartment",
    city: "punta-cana",
    description:
      "Small modern apartment with an impressive city view.",
    agent: {
      name: "Ashiqur Rahman",
      phone: "(123) 456-7890",
      email: "R9yQ2@example.com55",
      image: "/uploads/agent.png",
    },
  },
  {
    id: 6,
    image: "/uploads/abcd.png",
    title: "Diamond Manor Apartment",
    price: "259000",
    address: "7802 20th Ave, Brooklyn",
    beds: 3,
    baths: 2,
    sqft: 500,
    isFeatured: true,
    type: "sale",
    propertyType: "Condo",
    city: "bavaro",
    description:
      "A luxury condo with high-end finishes and a spacious interior.",
    agent: {
      name: "Ashiqur Rahman",
      phone: "(123) 456-7890",
      email: "R9yQ2@example.com55",
      image: "/uploads/agent.png",
    }
  },
    {
        id: 1,
        image: "/uploads/abc.png", images: [
            "/uploads/abcd.png",
            "/uploads/abc.png",
            "/uploads/abcd.png",
            "/uploads/abcd.png",
        ],
        title: "Luxury Family Home",
        price: "395000",
        address: "1800-1818 79th St",
        beds: 4,
        baths: 1,
        sqft: 400,
        isFeatured: true,
        type: "sale",
        city: "punta-cana",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ahsan Alam",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/images/agent2.png"
        }
    },
    {
        id: 2,
        image: "/uploads/abcd.png", images: [
            "/uploads/abcd.png",
            "/uploads/abc.png",
            "/uploads/abcd.png",
            "/uploads/abcd.png",
        ],
        title: "Skyper Pool Apartment",
        price: "280000",
        address: "1020 Bloomingdale Ave",
        beds: 4,
        baths: 2,
        sqft: 450,
        isFeatured: false,
        type: "sale",
        city: "bavaro",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ashiqur Rahman",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/uploads/agent.png"
        }
    },
    {
        id: 3,
        image: "/uploads/abc.png", images: [
            "/uploads/abcd.png",
            "/uploads/abc.png",
            "/uploads/abcd.png",
            "/uploads/abcd.png",
        ],
        title: "North Dillard Street",
        price: "250",
        address: "4330 Bill Shoals Rd",
        beds: 4,
        baths: 2,
        sqft: 400,
        isFeatured: false,
        type: "rent",
        city: "cocotal",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ahsan Alam",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/images/agent2.png"
        }
    },
    {
        id: 4,
        image: "/uploads/abcd.png", images: [
            "/uploads/abcd.png",
            "/uploads/abc.png",
            "/uploads/abcd.png",
            "/uploads/abcd.png",
        ],
        title: "Eaton Grant Penthouse",
        price: "180000",
        address: "7722 18th Ave, Brooklyn",
        beds: 4,
        baths: 2,
        sqft: 450,
        isFeatured: true,
        type: "sale",
        city: "cap-cana",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ashiqur Rahman",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/uploads/agent.png"
        }
    },
    {
        id: 5,
        image: "/uploads/abc.png",
        images: [
            "/uploads/abcd.png",
            "/uploads/abc.png",
            "/uploads/abcd.png",
            "/uploads/abcd.png",
        ],
        title: "New Apartment Nice View",
        price: "850",
        address: "42 Avenue O, Brooklyn",
        beds: 2,
        baths: 1,
        sqft: 460,
        isFeatured: true,
        type: "rent",
        city: "punta-cana",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ahsan Alam",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/images/agent2.png"
        }
    },
    {
        id: 6,
        image: "/uploads/abcd.png",   images: [
            "/uploads/abcd.png",
            "/uploads/abc.png",
            "/uploads/abcd.png",
            "/uploads/abcd.png",
        ],
        title: "Diamond Manor Apartment",
        price: "259000",
        address: "7802 20th Ave, Brooklyn",
        beds: 3,
        baths: 2,
        sqft: 500,
        isFeatured: true,
        type: "sale",
        city: "bavaro",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ahsan Alam",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/images/agent2.png"
        }
    },
];

export const usePropertyStore = create((set, get) => ({
  properties: initialProperties,

  setProperties: (data) => set({ properties: data }),

  getPropertyById: (id) =>
    get().properties.find((p) => String(p.id) === String(id)),
}));
