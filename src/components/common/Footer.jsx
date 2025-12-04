import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";


export default function Footer() {
    const popupMaker = (service) => () => {

        alert(`You clicked on ${service}. More information will be available soon!`);

    }

    return (
        <footer className="bg-[#F8F4F1] text-black py-16 shadow-inner">
            <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-4 gap-10">

                {/* About Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">
                        <Image src="/logo.png"
                            width={180}
                            height={80}
                            alt="Logo" />
                    </h2>
                    <p className="text-sm text-black/70">
                        Discover your dream property in Punta Cana with our expert guidance. We make buying and investing easy and secure.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-black/70">
                        <li> <Link href="/" className="hover:text-brandAccent transition-colors duration-200">Home</Link> </li>
                        <li><Link href="/pages/about" className="hover:text-brandAccent transition-colors duration-200">About Us</Link></li>
                        <li><Link href="/pages/properties" className="hover:text-brandAccent transition-colors duration-200">Properties</Link></li>
                        <li><Link href="/pages/contact" className="hover:text-brandAccent transition-colors duration-200">Contact</Link></li>
                        <li><Link href="/pages/blog" className="hover:text-brandAccent transition-colors duration-200">Blog</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Services</h3>
                    <ul className="space-y-2 text-black/70">
                        <li>
                            <button className="hover:text-brandAccent transition-colors duration-200">Property Buying</button>
                        </li>
                        <li>
                            <button className="hover:text-brandAccent transition-colors duration-200">Property Selling</button>
                        </li>
                        <li>
                            <button className="hover:text-brandAccent transition-colors duration-200">Investment Consulting</button>
                        </li>
                        <li>
                            <button className="hover:text-brandAccent transition-colors duration-200">Legal Assistance</button>
                        </li>
                    </ul>
                </div>

                {/* Contact & Social */}
                <div>
                    <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                    <p className="text-black/70">123 Beachfront Ave, Punta Cana, DR</p>
                    <p className="text-black/70 mt-2">Email: info@puntacanarealestate.com</p>
                    <p className="text-black/70 mt-2">Phone: +1 809 123 4567</p>

                    <div className="flex mt-4 space-x-3">
                        <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-brandAccent hover:text-white transition duration-200">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-brandAccent hover:text-white transition duration-200">
                            <FaTwitter />
                        </a>
                        <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-brandAccent hover:text-white transition duration-200">
                            <FaInstagram />
                        </a>
                        <a href="#" className="p-2 bg-black/5 rounded-full hover:bg-brandAccent hover:text-white transition duration-200">
                            <FaLinkedinIn />
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-12 text-center text-black/50 text-sm">
                &copy; {new Date().getFullYear()} Punta Cana Real Estate. All rights reserved.
            </div>
        </footer>
    )
}
