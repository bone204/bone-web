import { getAccessToken } from "@/utils/token";

export interface VehicleCatalogItem {
  id: number;
  type: string;
  brand: string;
  model: string;
  color: string;
  seatingCapacity: number;
  fuelType?: string;
  maxSpeed?: number;
  transmission?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchVehicleCatalog(params?: {
  type?: string;
  brand?: string;
  model?: string;
}): Promise<VehicleCatalogItem[]> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError(401, 'No access token');
  }

  const queryParams = new URLSearchParams();
  if (params?.type) queryParams.append('type', params.type);
  if (params?.brand) queryParams.append('brand', params.brand);
  if (params?.model) queryParams.append('model', params.model);

  const queryString = queryParams.toString();
  const url = `http://localhost:4000/vehicle-catalog${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to fetch vehicle catalog: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchVehicleCatalogById(id: number): Promise<VehicleCatalogItem> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError(401, 'No access token');
  }

  const response = await fetch(`http://localhost:4000/vehicle-catalog/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to fetch vehicle catalog item: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteVehicleCatalog(id: number): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new ApiError(401, 'No access token');
  }

  const response = await fetch(`http://localhost:4000/vehicle-catalog/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, `Failed to delete vehicle catalog item: ${response.statusText}`);
  }
}
