import Image from "next/image";
import Link from "next/link";

export type LocationCardProps = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price?: string;
  rating?: number;
  location?: string;
  href?: string;
};

export function LocationCard({
  name,
  description,
  imageUrl,
  price,
  rating,
  location,
  href = "#",
}: LocationCardProps) {
  return (
    <article className="location-card">
      <Link href={href} className="location-card__link">
        <div className="location-card__image-wrapper">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="location-card__image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {rating && (
            <div className="location-card__rating">
              <span className="location-card__rating-icon">⭐</span>
              <span className="location-card__rating-value">{rating}</span>
            </div>
          )}
        </div>
        <div className="location-card__content">
          {location && (
            <p className="location-card__location">{location}</p>
          )}
          <h3 className="location-card__title">{name}</h3>
          <p className="location-card__description">{description}</p>
          <span className="location-card__read-more">Xem thêm</span>
          {price && (
            <div className="location-card__price">
              <span className="location-card__price-label">Từ</span>
              <span className="location-card__price-value">{price}</span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}

