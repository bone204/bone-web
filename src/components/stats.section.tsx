"use client";

import { useEffect, useRef, useState } from "react";

type StatItem = {
  value: string;
  label: string;
  suffix?: string;
};

const stats: StatItem[] = [
  { value: "50,000+", label: "Khách hàng hài lòng", suffix: "+" },
  { value: "500+", label: "Tour du lịch", suffix: "+" },
  { value: "100+", label: "Điểm đến", suffix: "+" },
  { value: "98%", label: "Tỷ lệ hài lòng", suffix: "%" },
];

export function StatsSection() {
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
      className={`stats-section ${isVisible ? "stats-section--visible" : ""}`}
    >
      <div className="stats-section__container">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="stats-section__item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="stats-section__value">
              {stat.value}
            </div>
            <div className="stats-section__label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

