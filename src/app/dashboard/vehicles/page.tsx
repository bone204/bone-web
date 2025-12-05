"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    useGetVehiclesQuery, 
    useDeleteVehicleMutation, 
    useApproveVehicleMutation, 
    useRejectVehicleMutation,
    VehicleApprovalStatus,
    VehicleAvailabilityStatus,
    type VehicleItem
} from "./vehicles.api";
import { logout } from "@/utils/token";

export default function VehiclesPage() {
    const { data: vehicles = [], isLoading, error, refetch } = useGetVehiclesQuery();
    const [deleteVehicle] = useDeleteVehicleMutation();
    const [approveVehicle] = useApproveVehicleMutation();
    const [rejectVehicle] = useRejectVehicleMutation();

    const [q, setQ] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [page, setPage] = useState<number>(1);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | null>(null);
    const pageSize = 6;
    const router = useRouter();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenDropdown(null);
            setDropdownPosition(null);
        };

        if (openDropdown) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    const filtered = useMemo(() => {
        let result = vehicles;
        
        // Filter by status (approval status or availability status)
        if (statusFilter !== "all") {
            result = result.filter(v => {
                // Match approval status
                if (v.status === statusFilter) return true;
                
                // Match availability status (only for approved vehicles)
                if (v.status === VehicleApprovalStatus.APPROVED && v.availability === statusFilter) return true;
                
                return false;
            });
        }
        
        // Filter by search term
        const term = q.trim().toLowerCase();
        if (term) {
            result = result.filter(v =>
                [v.licensePlate, v.description, v.contractId.toString()]
                    .filter(Boolean)
                    .some(val => String(val).toLowerCase().includes(term))
            );
        }
        
        return result;
    }, [vehicles, q, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const getStatusBadgeClass = (status: VehicleApprovalStatus) => {
        const baseClass = "dashboard-badge";
        switch (status) {
            case VehicleApprovalStatus.APPROVED: return `${baseClass} ${baseClass}--success`;
            case VehicleApprovalStatus.PENDING: return `${baseClass} ${baseClass}--warning`;
            case VehicleApprovalStatus.REJECTED: return `${baseClass} ${baseClass}--danger`;
            case VehicleApprovalStatus.INACTIVE: return `${baseClass} ${baseClass}--neutral`;
            default: return `${baseClass} ${baseClass}--neutral`;
        }
    };

    const getStatusText = (status: VehicleApprovalStatus) => {
        switch (status) {
            case VehicleApprovalStatus.PENDING:
                return "Chờ duyệt";
            case VehicleApprovalStatus.APPROVED:
                return "Đã duyệt";
            case VehicleApprovalStatus.REJECTED:
                return "Từ chối";
            case VehicleApprovalStatus.INACTIVE:
                return "Không hoạt động";
            default:
                return status;
        }
    };

    const getAvailabilityBadgeClass = (availability: VehicleAvailabilityStatus) => {
        const baseClass = "dashboard-badge";
        switch (availability) {
            case VehicleAvailabilityStatus.AVAILABLE: return `${baseClass} ${baseClass}--success`;
            case VehicleAvailabilityStatus.RENTED: return `${baseClass} ${baseClass}--info`;
            case VehicleAvailabilityStatus.MAINTENANCE: return `${baseClass} ${baseClass}--warning`;
            default: return `${baseClass} ${baseClass}--neutral`;
        }
    };

    const getAvailabilityText = (availability: VehicleAvailabilityStatus) => {
        switch (availability) {
            case VehicleAvailabilityStatus.AVAILABLE:
                return "Sẵn sàng";
            case VehicleAvailabilityStatus.RENTED:
                return "Đang cho thuê";
            case VehicleAvailabilityStatus.MAINTENANCE:
                return "Bảo trì";
            default:
                return availability;
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "—";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
        } catch {
            return "—";
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    const handleLogout = () => {
        logout();
        router.replace("/");
    };

    const handleDeleteVehicle = async (licensePlate: string) => {
        if (!confirm(`Bạn có chắc muốn xóa xe ${licensePlate}?`)) return;
        try {
            await deleteVehicle(licensePlate).unwrap();
            setOpenDropdown(null);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Không thể xóa xe";
            alert(msg);
        }
    };

    const handleApproveVehicle = async (licensePlate: string) => {
        if (!confirm(`Bạn có chắc muốn duyệt xe ${licensePlate}?`)) return;
        try {
            await approveVehicle(licensePlate).unwrap();
            setOpenDropdown(null);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Không thể duyệt xe";
            alert(msg);
        }
    };

    const handleRejectVehicle = async (licensePlate: string) => {
        const reason = prompt("Nhập lý do từ chối:");
        if (!reason?.trim()) return;
        try {
            await rejectVehicle({ licensePlate, reason }).unwrap();
            setOpenDropdown(null);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Không thể từ chối xe";
            alert(msg);
        }
    };

    const handleViewDetail = (vehicle: VehicleItem) => {
        setSelectedVehicle(vehicle);
        setOpenDropdown(null);
    };

    const handleCloseModal = () => {
        setSelectedVehicle(null);
    };

    return (
        <div className="dashboard-view" onClick={() => setOpenDropdown(null)}>

            {isLoading && (
                <div className="dashboard-loading">
                    <div className="dashboard-spinner"></div>
                    <p style={{ marginTop: "1rem" }}>Đang tải dữ liệu...</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="dashboard-error">
                    <div className="dashboard-error-icon">⚠️</div>
                    <p style={{ marginBottom: "0.5rem", fontWeight: 600 }}>Không thể tải dữ liệu</p>
                    <div className="dashboard-error-actions">
                        {/* @ts-expect-error: error type is unknown */}
                        {error?.status === 401 ? (
                            <button onClick={handleLogout} className="dashboard-btn dashboard-btn--primary">Đăng nhập lại</button>
                        ) : (
                            <button onClick={() => refetch()} className="dashboard-btn dashboard-btn--primary">Thử lại</button>
                        )}
                    </div>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    <div className="dashboard-toolbar">
                        <input
                            className="dashboard-search"
                            value={q}
                            onChange={(e) => { setQ(e.target.value); setPage(1); }}
                            placeholder="🔍 Tìm kiếm theo biển số, mô tả, mã hợp đồng..."
                        />
                        <select
                            className="dashboard-search"
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                            style={{ maxWidth: "200px" }}
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value={VehicleApprovalStatus.PENDING}>Chờ duyệt</option>
                            <option value={VehicleApprovalStatus.APPROVED}>Đã duyệt</option>
                            <option value={VehicleApprovalStatus.REJECTED}>Từ chối</option>
                            <option value={VehicleApprovalStatus.INACTIVE}>Không hoạt động</option>
                            <option disabled>──────────</option>
                            <option value={VehicleAvailabilityStatus.AVAILABLE}>Sẵn sàng</option>
                            <option value={VehicleAvailabilityStatus.RENTED}>Đang cho thuê</option>
                            <option value={VehicleAvailabilityStatus.MAINTENANCE}>Bảo trì</option>
                        </select>
                    </div>

                    <div className="dashboard-table-container">
                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "120px" }}>Biển số</th>
                                        <th style={{ width: "100px" }}>Hợp đồng</th>
                                        <th style={{ width: "150px" }}>Giá thuê (giờ)</th>
                                        <th style={{ width: "150px" }}>Giá thuê (ngày)</th>
                                        <th style={{ width: "120px" }}>Trạng thái</th>
                                        <th style={{ width: "120px" }}>Tình trạng</th>
                                        <th style={{ width: "150px" }}>Ngày tạo</th>
                                        <th style={{ width: "60px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageData.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                                                Không tìm thấy xe nào
                                            </td>
                                        </tr>
                                    ) : (
                                        pageData.map((vehicle) => (
                                            <tr key={vehicle.licensePlate}>
                                                <td style={{ fontWeight: 600 }}>{vehicle.licensePlate}</td>
                                                <td style={{ color: "#64748b" }}>#{vehicle.contractId}</td>
                                                <td style={{ color: "#64748b" }}>{formatPrice(vehicle.pricePerHour)}</td>
                                                <td style={{ color: "#64748b" }}>{formatPrice(vehicle.pricePerDay)}</td>
                                                <td>
                                                    <span className={getStatusBadgeClass(vehicle.status)}>
                                                        {getStatusText(vehicle.status)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {vehicle.status === VehicleApprovalStatus.APPROVED ? (
                                                        <span className={getAvailabilityBadgeClass(vehicle.availability)}>
                                                            {getAvailabilityText(vehicle.availability)}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: "#94a3b8" }}>—</span>
                                                    )}
                                                </td>
                                                <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                                                    {formatDate(vehicle.createdAt)}
                                                </td>
                                                <td className="dashboard-action-cell">
                                                    <button
                                                        className="dashboard-action-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const windowHeight = window.innerHeight;
                                                            const dropdownHeight = 150; // Estimated height
                                                            
                                                            const spaceBelow = windowHeight - rect.bottom;
                                                            const shouldShowAbove = spaceBelow < dropdownHeight;
                                                            
                                                            setDropdownPosition({
                                                                top: shouldShowAbove ? rect.top - dropdownHeight : rect.bottom + 2,
                                                                right: window.innerWidth - rect.right
                                                            });
                                                            setOpenDropdown(openDropdown === vehicle.licensePlate ? null : vehicle.licensePlate);
                                                        }}
                                                    >
                                                        ⋮
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="dashboard-pagination">
                            <div className="dashboard-pagination-info">
                                Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filtered.length)} trong tổng số {filtered.length} xe
                            </div>
                            <div className="dashboard-pagination-controls">
                                <button 
                                    className="dashboard-pagination-btn"
                                    disabled={currentPage <= 1} 
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                >
                                    ← Trước
                                </button>
                                <span style={{ padding: "0 0.75rem", color: "#475569", fontWeight: 500 }}>
                                    {currentPage} / {totalPages}
                                </span>
                                <button 
                                    className="dashboard-pagination-btn"
                                    disabled={currentPage >= totalPages} 
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                >
                                    Sau →
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Dropdown menu - rendered outside table */}
            {openDropdown && dropdownPosition && (
                <div 
                    className="dashboard-dropdown-fixed"
                    style={{
                        position: 'fixed',
                        top: `${dropdownPosition.top}px`,
                        right: `${dropdownPosition.right}px`,
                        zIndex: 1000
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {pageData.find(v => v.licensePlate === openDropdown) && (() => {
                        const vehicle = pageData.find(v => v.licensePlate === openDropdown)!;
                        return (
                            <>
                                <button
                                    className="dashboard-dropdown-item"
                                    onClick={() => handleViewDetail(vehicle)}
                                >
                                    <span style={{ marginRight: "0.5rem" }}>👁️</span>
                                    Xem chi tiết
                                </button>
                                {vehicle.status === VehicleApprovalStatus.PENDING && (
                                    <>
                                        <button
                                            className="dashboard-dropdown-item"
                                            onClick={() => handleApproveVehicle(vehicle.licensePlate)}
                                            style={{ color: "#10b981" }}
                                        >
                                            <span style={{ marginRight: "0.5rem" }}>✓</span>
                                            Duyệt
                                        </button>
                                        <button
                                            className="dashboard-dropdown-item"
                                            onClick={() => handleRejectVehicle(vehicle.licensePlate)}
                                            style={{ color: "#f59e0b" }}
                                        >
                                            <span style={{ marginRight: "0.5rem" }}>✕</span>
                                            Từ chối
                                        </button>
                                    </>
                                )}
                                <button
                                    className="dashboard-dropdown-item dashboard-dropdown-item--danger"
                                    onClick={() => handleDeleteVehicle(vehicle.licensePlate)}
                                >
                                    <span style={{ marginRight: "0.5rem" }}>🗑️</span>
                                    Xóa
                                </button>
                            </>
                        );
                    })()}
                </div>
            )}

            {/* Detail Modal */}
            {selectedVehicle && (
                <div className="dashboard-modal-overlay" onClick={handleCloseModal}>
                    <div className="dashboard-modal" onClick={e => e.stopPropagation()}>
                        <div className="dashboard-modal-header">
                            <h3 className="dashboard-modal-title">Chi tiết xe {selectedVehicle.licensePlate}</h3>
                            <button className="dashboard-modal-close" onClick={handleCloseModal}>✕</button>
                        </div>
                        <div className="dashboard-modal-body">
                            <div className="dashboard-detail-grid">
                                <div className="dashboard-detail-item">
                                    <label>Biển số</label>
                                    <p>{selectedVehicle.licensePlate}</p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Mã hợp đồng</label>
                                    <p>#{selectedVehicle.contractId}</p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Trạng thái duyệt</label>
                                    <p>
                                        <span className={getStatusBadgeClass(selectedVehicle.status)}>
                                            {getStatusText(selectedVehicle.status)}
                                        </span>
                                    </p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Tình trạng</label>
                                    <p>
                                        <span className={getAvailabilityBadgeClass(selectedVehicle.availability)}>
                                            {getAvailabilityText(selectedVehicle.availability)}
                                        </span>
                                    </p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Giá thuê (giờ)</label>
                                    <p>{formatPrice(selectedVehicle.pricePerHour)}</p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Giá thuê (ngày)</label>
                                    <p>{formatPrice(selectedVehicle.pricePerDay)}</p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Tổng số chuyến</label>
                                    <p>{selectedVehicle.totalRentals}</p>
                                </div>
                                <div className="dashboard-detail-item">
                                    <label>Đánh giá trung bình</label>
                                    <p>{selectedVehicle.averageRating} ⭐</p>
                                </div>
                                <div className="dashboard-detail-item" style={{ gridColumn: "1 / -1" }}>
                                    <label>Mô tả</label>
                                    <p>{selectedVehicle.description || "—"}</p>
                                </div>
                                <div className="dashboard-detail-item" style={{ gridColumn: "1 / -1" }}>
                                    <label>Yêu cầu</label>
                                    <p>{selectedVehicle.requirements || "—"}</p>
                                </div>
                                {selectedVehicle.rejectedReason && (
                                    <div className="dashboard-detail-item" style={{ gridColumn: "1 / -1" }}>
                                        <label style={{ color: "#dc2626" }}>Lý do từ chối</label>
                                        <p style={{ color: "#dc2626" }}>{selectedVehicle.rejectedReason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
