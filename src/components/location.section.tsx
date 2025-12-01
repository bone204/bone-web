"use client";

import { useEffect, useRef, useState } from "react";
import { LocationCard, LocationCardProps } from "./location.card";

export type LocationSectionProps = {
  title: string;
  subtitle?: string;
  locations: LocationCardProps[];
  className?: string;
};

export function LocationSection({
  title,
  subtitle,
  locations,
  className = "",
}: LocationSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`location-section ${className} ${isVisible ? "location-section--visible" : ""}`}
    >
      <div className="location-section__container">
        <div className="location-section__header">
          <h2 className="location-section__title">{title}</h2>
          {subtitle && (
            <p className="location-section__subtitle">{subtitle}</p>
          )}
        </div>
        <div className="location-section__grid">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className="location-section__card-wrapper"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <LocationCard {...location} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

