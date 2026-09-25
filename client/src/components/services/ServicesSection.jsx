import { useRef } from "react";
import { useScroll } from "framer-motion";
import ServiceCard from "./ServiceCard";
import { services } from "./ServiceCardData";

export default function ServicesSection() {
  const containerRef = useRef(null);

  // Track scroll progress across the whole stack.
  // Each sticky card wrapper is exactly 100svh of normal flow,
  // so the container is naturally N screens tall — this gives
  // every card exactly one viewport of scroll travel.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {services.map((service, index) => (
        <ServiceCard
          key={service.number}
          service={service}
          index={index}
          total={services.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}
