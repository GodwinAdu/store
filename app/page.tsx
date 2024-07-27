
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-10 md:px-20 lg:px-40 h-screen flex items-center justify-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-1">
          <div className="text-center md:text-left md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Simplify Your <span className="text-yellow-300">Point of Sale</span> Experience
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Manage sales, inventory, and customer data with ease using our cutting-edge POS system.
            </p>
            <Link href="/sign-in" className="bg-yellow-300 text-blue-800 py-3 px-6 border-2 border-black rounded-full text-lg font-semibold transition duration-300 hover:bg-yellow-400">
              Sign In
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center md:pl-10">
            <Image
              src="/hero1.jpg"
              alt="POS System"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
}
