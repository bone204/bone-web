/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

type TestimonialComment = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  location?: string;
};

const testimonials: TestimonialComment[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanA",
    rating: 5,
    comment: "Tour Đà Nẵng tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý. Chắc chắn sẽ quay lại!",
    location: "Đà Nẵng",
  },
  {
    id: "2",
    name: "Trần Thị B",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TranThiB",
    rating: 5,
    comment: "Dịch vụ chuyên nghiệp từ A-Z. Từ đặt tour đến hỗ trợ trong chuyến đi đều rất tốt!",
    location: "Phú Quốc",
  },
  {
    id: "3",
    name: "Phạm Thị D",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PhamThiD",
    rating: 5,
    comment: "Giá cả hợp lý, chất lượng dịch vụ vượt mong đợi. Gia đình tôi rất hài lòng!",
    location: "Sapa",
  },
];

export function TestimonialSection() {
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
      className={`testimonial-section ${isVisible ? "testimonial-section--visible" : ""}`}
    >
      <div className="testimonial-section__container">
        {/* Left side - Introduction */}
        <div className="testimonial-section__intro">
          <div className="testimonial-section__intro-content">
            <h2 className="testimonial-section__title">
              Cảm nhận của khách hàng
            </h2>
            <p className="testimonial-section__subtitle">
              Hơn 50,000 khách hàng đã tin tưởng và lựa chọn chúng tôi cho hành trình du lịch của mình
            </p>
            <p className="testimonial-section__description">
              Chúng tôi tự hào mang đến những trải nghiệm du lịch đáng nhớ với dịch vụ chuyên nghiệp, 
              tận tâm. Mỗi chuyến đi là một câu chuyện đẹp được viết nên bởi sự hài lòng và niềm vui 
              của quý khách hàng.
            </p>
            <div className="testimonial-section__stats">
              <div className="testimonial-section__stat-item">
                <div className="testimonial-section__stat-value">98%</div>
                <div className="testimonial-section__stat-label">Khách hàng hài lòng</div>
              </div>
              <div className="testimonial-section__stat-item">
                <div className="testimonial-section__stat-value">4.9/5</div>
                <div className="testimonial-section__stat-label">Đánh giá trung bình</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Animated Comments */}
        <div className="testimonial-section__comments">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="testimonial-card__header">
                <div className="testimonial-card__avatar">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="testimonial-card__avatar-img"
                  />
                </div>
                <div className="testimonial-card__info">
                  <div className="testimonial-card__name">{testimonial.name}</div>
                  {testimonial.location && (
                    <div className="testimonial-card__location">
                      📍 {testimonial.location}
                    </div>
                  )}
                </div>
                <div className="testimonial-card__rating">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="testimonial-card__star">⭐</span>
                  ))}
                </div>
              </div>
              <div className="testimonial-card__comment">
                <p>{testimonial.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

