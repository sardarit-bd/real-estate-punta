import { create } from "zustand";

const initialProperties = [
    {
        id: 1,
        image: "/uploads/abc.png",
        title: "Luxury Family Home",
        price: "395,000",
        address: "1800-1818 79th St",
        beds: 4,
        baths: 1,
        sqft: 400,
        isFeatured: true,
        type: "sale",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ashiqur Rahman",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/uploads/agent.png"
        }
    },
    {
        id: 2,
        image: "/uploads/abcd.png",
        title: "Skyper Pool Apartment",
        price: "280,000",
        address: "1020 Bloomingdale Ave",
        beds: 4,
        baths: 2,
        sqft: 450,
        isFeatured: false,
        type: "sale",
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
        image: "/uploads/abc.png",
        title: "North Dillard Street",
        price: "250",
        address: "4330 Bill Shoals Rd",
        beds: 4,
        baths: 2,
        sqft: 400,
        isFeatured: false,
        type: "rent",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ashiqur Rahman",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/uploads/agent.png"
        }
    },
    {
        id: 4,
        image: "/uploads/abcd.png",
        title: "Eaton Grant Penthouse",
        price: "180,000",
        address: "7722 18th Ave, Brooklyn",
        beds: 4,
        baths: 2,
        sqft: 450,
        isFeatured: true,
        type: "sale",
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
        title: "New Apartment Nice View",
        price: "850",
        address: "42 Avenue O, Brooklyn",
        beds: 4,
        baths: 1,
        sqft: 460,
        isFeatured: true,
        type: "rent",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ashiqur Rahman",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/uploads/agent.png"
        }
    },
    {
        id: 6,
        image: "/uploads/abcd.png",
        title: "Diamond Manor Apartment",
        price: "259,000",
        address: "7802 20th Ave, Brooklyn",
        beds: 4,
        baths: 2,
        sqft: 500,
        isFeatured: true,
        type: "sale",
        description: "A beautiful apartment with stunning views and modern amenities. Perfect for urban living",
        agent: {
            name: "Ashiqur Rahman",
            phone: "(123) 456-7890",
            email: "R9yQ2@example.com55",
            image: "/uploads/agent.png"
        }
    },
];

export const usePropertyStore = create((set, get) => ({
    properties: initialProperties,

    setProperties: (data) => set({ properties: data }),

    getPropertyById: (id) =>
        get().properties.find((p) => String(p.id) === String(id)),
}));
