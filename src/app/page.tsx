"use client";

import { HeroCarousel } from "@/components/hero.carousel";
import { ServicesSection } from "@/components/services.section";
import { StatsSection } from "@/components/stats.section";
import { TestimonialSection } from "@/components/testimonial.section";
import { LocationSection } from "@/components/location.section";
import { useGetDestinationsQuery } from "@/api/destinations.api";
export default function HomePage() {
  const { data: allLocations = [], isLoading, isError } =
    useGetDestinationsQuery({ available: true, limit: 16 });

  const featuredLocations = allLocations.slice(0, 6);
  const domesticLocations = allLocations.slice(6, 16);

  if (isLoading) {
    return (
      <div className="home-page">
        <HeroCarousel />
        <ServicesSection />
        <StatsSection />
        <TestimonialSection />
        <div className="container py-5">Đang tải điểm đến...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="home-page">
        <HeroCarousel />
        <ServicesSection />
        <StatsSection />
        <TestimonialSection />
        <div className="container py-5">Không thể tải điểm đến.</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <HeroCarousel />
      <ServicesSection />
      <StatsSection />
      <TestimonialSection />

      {featuredLocations.length > 0 && (
      <LocationSection
        title="Điểm đến nổi bật"
          subtitle="Những địa điểm được yêu thích nhất trên Traveline"
        locations={featuredLocations}
        className="location-section--featured"
      />
      )}

      {domesticLocations.length > 0 && (
      <LocationSection
          title="Khám phá Việt Nam"
          subtitle="Những điểm đến hấp dẫn dành cho hành trình tiếp theo của bạn"
        locations={domesticLocations}
        className="location-section--domestic"
      />
      )}
    </div>
  );
}
