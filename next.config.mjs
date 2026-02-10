/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const nextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: false,

};

export default nextConfig; 
