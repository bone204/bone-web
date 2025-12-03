import { getAccessToken } from "@/services/auth.service";

const API_BASE = "http://localhost:4000";

export interface Cooperation {
    id: number;
    code?: string;
    name: string;
    type: string;
    numberOfObjects: number;
    numberOfObjectTypes: number;
    bossName?: string;
    bossPhone?: string;
    bossEmail?: string;
    address?: string;
    district?: string;
    city?: string;
    province?: string;
    photo?: string;
    extension?: string;
    introduction?: string;
    contractDate?: string;
    contractTerm?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    bankName?: string;
    bookingTimes: number;
    revenue: string;
    averageRating: string;
    active: boolean;
    manager?: {
        id: number;
        email: string;
        name?: string;
    };
    userId?: number;
    createdAt: string;
    updatedAt: string;
}

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
        this.name = "ApiError";
    }
}

export async function fetchCooperations(params?: {
    type?: string;
    city?: string;
    province?: string;
    active?: boolean;
}): Promise<Cooperation[]> {
    const token = getAccessToken();
    if (!token) {
        throw new ApiError("Unauthorized", 401);
    }

    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append("type", params.type);
    if (params?.city) queryParams.append("city", params.city);
    if (params?.province) queryParams.append("province", params.province);
    if (params?.active !== undefined) queryParams.append("active", String(params.active));

    const url = `${API_BASE}/cooperations${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new ApiError(
            res.status === 401 ? "Unauthorized" : "Failed to fetch cooperations",
            res.status
        );
    }

    const data = await res.json();
    return data;
}

export async function fetchCooperationById(id: number): Promise<Cooperation> {
    const token = getAccessToken();
    if (!token) {
        throw new ApiError("Unauthorized", 401);
    }

    const res = await fetch(`${API_BASE}/cooperations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new ApiError(
            res.status === 401 ? "Unauthorized" : "Failed to fetch cooperation",
            res.status
        );
    }

    return await res.json();
}

export async function deleteCooperation(id: number): Promise<void> {
    const token = getAccessToken();
    if (!token) {
        throw new ApiError("Unauthorized", 401);
    }

    const res = await fetch(`${API_BASE}/cooperations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        throw new ApiError(
            res.status === 401 ? "Unauthorized" : "Failed to delete cooperation",
            res.status
        );
    }
}
