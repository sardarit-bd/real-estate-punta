"use client";

export default function GoogleMap() {
  return (
    <div className="max-w-7xl mx-auto h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241952.2335989279!2d-68.6372439069851!3d18.641381948960312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea891645dcbfe77%3A0x61881cfaed12f6f3!2s23000%20Punta%20Cana%2C%20Dominican%20Republic!5e0!3m2!1sen!2sbd!4v1764733957590!5m2!1sen!2sbd"
        className="w-full h-full"
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}