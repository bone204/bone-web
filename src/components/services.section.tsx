"use client";

import { useEffect, useRef, useState } from "react";

type ServiceItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

const services: ServiceItem[] = [
  {
    id: "1",
    icon: "✈️",
    title: "Tour du lịch trọn gói",
    description: "Lịch trình được thiết kế chi tiết, bao gồm vé máy bay, khách sạn, ăn uống và các hoạt động tham quan",
  },
  {
    id: "2",
    icon: "🏨",
    title: "Đặt phòng khách sạn",
    description: "Hỗ trợ đặt phòng tại các khách sạn, resort cao cấp với giá ưu đãi và đảm bảo chất lượng",
  },
  {
    id: "3",
    icon: "🚗",
    title: "Dịch vụ vận chuyển",
    description: "Xe đưa đón sân bay, thuê xe tự lái, và các phương tiện di chuyển trong suốt hành trình",
  },
  {
    id: "4",
    icon: "🎫",
    title: "Vé tham quan & hoạt động",
    description: "Đặt vé tham quan các điểm du lịch, show diễn, và các hoạt động giải trí độc đáo",
  },
  {
    id: "5",
    icon: "🍽️",
    title: "Ẩm thực địa phương",
    description: "Trải nghiệm ẩm thực đặc sắc với các nhà hàng được lựa chọn kỹ lưỡng và tour ẩm thực",
  },
  {
    id: "6",
    icon: "📞",
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ tư vấn và hỗ trợ luôn sẵn sàng 24/7 để giải đáp mọi thắc mắc trong suốt chuyến đi",
  },
];

export function ServicesSection() {
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
      className={`services-section ${isVisible ? "services-section--visible" : ""}`}
    >
      <div className="services-section__container">
        <div className="services-section__header">
          <h2 className="services-section__title">Dịch vụ của chúng tôi</h2>
          <p className="services-section__subtitle">
            Mang đến trải nghiệm du lịch trọn vẹn và đáng nhớ
          </p>
        </div>
        <div className="services-section__grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="services-section__card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="services-section__icon">{service.icon}</div>
              <h3 className="services-section__card-title">{service.title}</h3>
              <p className="services-section__card-description">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

