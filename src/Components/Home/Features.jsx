
import React from 'react'
import { GraduationCap, Wrench, Lightbulb } from "lucide-react";

const Features = () => {

     const features = [
    {
      icon: <GraduationCap size={36} className="text-gray-500 hover:text-white transition duration-300 ease-in-out" />,
      bg: "bg-white hover:bg-green-500",
      title: "Learn",
      desc: "Master cutting-edge technologies and industry-standard tools",
    },
    {
      icon: <Wrench size={36} className="text-gray-500 hover:text-white transition duration-300 ease-in-out" />,
      bg: "bg-white hover:bg-amber-800",
      title: "Build",
      desc: "Create real-world projects and prototypes that matter",
    },
    {
      icon: <Lightbulb size={36} className="text-gray-500 hover:text-white transition duration-300 ease-in-out" />,
      bg: "bg-white hover:bg-green-500",
      title: "Innovate",
      desc: "Push boundaries and solve tomorrow's challenges",
    },
  ];

  return (
     <section className="py-16 bg-white text-center">
      {/* Section Heading */}
      <h2 className="text-xl md:text-2xl text-gray-700 mb-12">
        We're a student-led initiative that bridges the gap between theory and hands-on engineering practice.
      </h2>

      {/* Features Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`${item.bg} w-20 h-20 flex items-center justify-center rounded-full mb-4`}>
              {item.icon}
            </div>
            {/* Title */}
            <h3 className="text-lg font-bold mb-2">{item.title}</h3>
            {/* Description */}
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features
