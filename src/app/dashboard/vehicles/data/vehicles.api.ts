import { getAccessToken } from "@/utils/token";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export enum VehicleApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  INACTIVE = "inactive",
}

export enum VehicleAvailabilityStatus {
  AVAILABLE = "available",
  RENTED = "rented",
  MAINTENANCE = "maintenance",
}

export type VehicleItem = {
  licensePlate: string;
  contractId: number;
  vehicleCatalogId?: number;
  pricePerHour: number;
  pricePerDay: number;
  requirements?: string;
  description?: string;
  vehicleRegistrationFront?: string;
  vehicleRegistrationBack?: string;
  status: VehicleApprovalStatus;
  rejectedReason?: string;
  availability: VehicleAvailabilityStatus;
  totalRentals: number;
  averageRating: number;
  createdAt?: string;
  updatedAt?: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchVehicles(): Promise<VehicleItem[]> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/rental-vehicles`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to fetch vehicles", res.status, text);
    throw new ApiError(text || `Fetch vehicles failed: ${res.status}`, res.status);
  }

  const data: unknown = await res.json();
  const arr = Array.isArray(data) ? data : [];
  return arr.map((v): VehicleItem => {
    const obj = v as Record<string, unknown>;
    return {
      licensePlate: String(obj.licensePlate ?? ""),
      contractId: Number(obj.contractId ?? 0),
      vehicleCatalogId: obj.vehicleCatalogId ? Number(obj.vehicleCatalogId) : undefined,
      pricePerHour: Number(obj.pricePerHour ?? 0),
      pricePerDay: Number(obj.pricePerDay ?? 0),
      requirements: typeof obj.requirements === "string" ? obj.requirements : undefined,
      description: typeof obj.description === "string" ? obj.description : undefined,
      vehicleRegistrationFront: typeof obj.vehicleRegistrationFront === "string" ? obj.vehicleRegistrationFront : undefined,
      vehicleRegistrationBack: typeof obj.vehicleRegistrationBack === "string" ? obj.vehicleRegistrationBack : undefined,
      status: (obj.status as VehicleApprovalStatus) ?? VehicleApprovalStatus.PENDING,
      rejectedReason: typeof obj.rejectedReason === "string" ? obj.rejectedReason : undefined,
      availability: (obj.availability as VehicleAvailabilityStatus) ?? VehicleAvailabilityStatus.AVAILABLE,
      totalRentals: Number(obj.totalRentals ?? 0),
      averageRating: Number(obj.averageRating ?? 0),
      createdAt: typeof obj.createdAt === "string" ? obj.createdAt : undefined,
      updatedAt: typeof obj.updatedAt === "string" ? obj.updatedAt : undefined,
    };
  });
}

export async function deleteVehicle(licensePlate: string): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/rental-vehicles/${licensePlate}`, {
    method: "DELETE",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to delete vehicle", res.status, text);
    throw new ApiError(text || `Delete vehicle failed: ${res.status}`, res.status);
  }
}

export async function approveVehicle(licensePlate: string): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/rental-vehicles/${licensePlate}/approve`, {
    method: "PATCH",
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to approve vehicle", res.status, text);
    throw new ApiError(text || `Approve vehicle failed: ${res.status}`, res.status);
  }
}

export async function rejectVehicle(licensePlate: string, reason: string): Promise<void> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/rental-vehicles/${licensePlate}/reject`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ rejectedReason: reason }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Failed to reject vehicle", res.status, text);
    throw new ApiError(text || `Reject vehicle failed: ${res.status}`, res.status);
  }
}
