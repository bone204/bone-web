import type { LocationCardProps } from "@/components/location.card";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export type DestinationDto = {
  id: number;
  name: string;
  descriptionViet?: string;
  descriptionEng?: string;
  province?: string;
  district?: string;
  photos?: string[];
  rating?: number;
};

function mapDestinationToLocationCard(
  destination: DestinationDto,
): LocationCardProps {
  const {
    id,
    name,
    descriptionViet,
    descriptionEng,
    province,
    district,
    photos,
    rating,
  } = destination;

  const description =
    descriptionViet ??
    descriptionEng ??
    "Địa điểm đang chờ bạn khám phá cùng Traveline.";

  const imageUrl =
    photos && photos.length > 0
      ? photos[0]
      : "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop";

  const locationLabel = [district, province].filter(Boolean).join(", ");

  return {
    id: String(id),
    name,
    description,
    imageUrl,
    rating,
    location: locationLabel || undefined,
    href: "/empty-page",
  };
}

export async function fetchDestinations(options?: {
  q?: string;
  limit?: number;
  offset?: number;
  available?: boolean;
}): Promise<LocationCardProps[]> {
  const params = new URLSearchParams();

  if (options?.q) params.set("q", options.q);
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.offset) params.set("offset", String(options.offset));
  if (options?.available !== undefined)
    params.set("available", String(options.available));

  const url = `${API_BASE_URL}/destinations${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  const res = await fetch(url, {
    // Luôn lấy dữ liệu mới trong môi trường dev
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch destinations", res.status, await res.text());
    return [];
  }

  const data = (await res.json()) as DestinationDto[];
  return data.map(mapDestinationToLocationCard);
}



