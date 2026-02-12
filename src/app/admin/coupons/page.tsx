'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Copy,
    Tag,
    Calendar,
    Percent,
    DollarSign,
    Check,
    X,
    Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discountType: 'PERCENTAGE' | 'FLAT';
    discountValue: number;
    maxDiscount: number | null;
    minOrderValue: number | null;
    validFrom: string;
    validUntil: string | null;
    usageLimit: number | null;
    usedCount: number;
    isActive: boolean;
    createdAt: string;
    _count?: { orders: number };
}

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: '',
        maxDiscount: '',
        minOrderValue: '',
        validFrom: '',
        validUntil: '',
        usageLimit: '',
        isActive: true,
    });

    // Fetch coupons
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/coupons');
            if (res.ok) {
                const data = await res.json();
                setCoupons(data);
            } else {
                toast.error('Failed to load coupons');
            }
        } catch (error) {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const openAddModal = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            description: '',
            discountType: 'PERCENTAGE',
            discountValue: '',
            maxDiscount: '',
            minOrderValue: '',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            usageLimit: '',
            isActive: true,
        });
        setShowModal(true);
    };

    const openEditModal = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            description: coupon.description || '',
            discountType: coupon.discountType,
            discountValue: coupon.discountValue.toString(),
            maxDiscount: coupon.maxDiscount?.toString() || '',
            minOrderValue: coupon.minOrderValue?.toString() || '',
            validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
            validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
            usageLimit: coupon.usageLimit?.toString() || '',
            isActive: coupon.isActive,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!formData.code || !formData.discountValue) {
            toast.error('Code and discount value are required');
            return;
        }
        setSaving(true);
        try {
            const url = editingCoupon
                ? `/api/admin/coupons/${editingCoupon.id}`
                : '/api/admin/coupons';
            const method = editingCoupon ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                toast.success(editingCoupon ? 'Coupon updated!' : 'Coupon created!');
                setShowModal(false);
                fetchCoupons();
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to save coupon');
            }
        } catch (error) {
            toast.error('Failed to save coupon');
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (coupon: Coupon) => {
        try {
            const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !coupon.isActive }),
            });
            if (res.ok) {
                toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`);
                fetchCoupons();
            }
        } catch {
            toast.error('Failed to update coupon');
        }
    };

    const deleteCoupon = async (id: string) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Coupon deleted');
                fetchCoupons();
            } else {
                toast.error('Failed to delete coupon');
            }
        } catch {
            toast.error('Failed to delete coupon');
        }
    };

    const copyCoupon = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success('Coupon code copied!');
    };

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Coupon Management</h1>
                    <p className="text-muted-foreground">Create and manage discount coupons</p>
                </div>
                <button onClick={openAddModal} className="btn-primary">
                    <Plus className="w-5 h-5" />
                    Add New Coupon
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Coupons</p>
                    <p className="text-2xl font-bold text-foreground">{coupons.length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold text-emerald-600">{coupons.filter(c => c.isActive).length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Used</p>
                    <p className="text-2xl font-bold text-foreground">{coupons.reduce((sum, c) => sum + c.usedCount, 0)}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Inactive</p>
                    <p className="text-2xl font-bold text-amber-600">{coupons.filter(c => !c.isActive).length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="card p-4 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search coupons..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input pl-11"
                    />
                </div>
            </div>

            {/* Coupons Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-border">
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Code</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Description</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Discount</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Min Order</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Valid Until</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Usage</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                                        {searchQuery ? 'No coupons match your search' : 'No coupons yet. Create your first coupon!'}
                                    </td>
                                </tr>
                            ) : (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-primary" />
                                                <span className="font-mono font-semibold text-foreground">{coupon.code}</span>
                                                <button
                                                    onClick={() => copyCoupon(coupon.code)}
                                                    className="p-1 rounded hover:bg-secondary"
                                                    title="Copy code"
                                                >
                                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{coupon.description || '-'}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                {coupon.discountType === 'PERCENTAGE' ? (
                                                    <>
                                                        <Percent className="w-4 h-4 text-accent" />
                                                        <span className="font-semibold">{coupon.discountValue}%</span>
                                                        {coupon.maxDiscount && (
                                                            <span className="text-sm text-muted-foreground">(max ₹{coupon.maxDiscount})</span>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <DollarSign className="w-4 h-4 text-accent" />
                                                        <span className="font-semibold">₹{coupon.discountValue}</span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {coupon.minOrderValue ? `₹${coupon.minOrderValue}` : '-'}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {coupon.validUntil
                                                        ? new Date(coupon.validUntil).toLocaleDateString()
                                                        : 'No expiry'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium">{coupon.usedCount}</span>
                                            {coupon.usageLimit && (
                                                <span className="text-muted-foreground"> / {coupon.usageLimit}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleActive(coupon)}
                                                className={`badge cursor-pointer ${coupon.isActive
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {coupon.isActive ? (
                                                    <><Check className="w-3 h-3 mr-1" /> Active</>
                                                ) : (
                                                    <><X className="w-3 h-3 mr-1" /> Inactive</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEditModal(coupon)}
                                                    className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCoupon(coupon.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-foreground">
                                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-secondary"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Coupon Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="e.g., WELCOME50"
                                    className="input font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="e.g., 50% off for new users"
                                    className="input"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Discount Type</label>
                                    <select
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                        className="input"
                                    >
                                        <option value="PERCENTAGE">Percentage (%)</option>
                                        <option value="FLAT">Fixed (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Discount Value <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                        placeholder={formData.discountType === 'PERCENTAGE' ? '50' : '100'}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Max Discount (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                        placeholder="100"
                                        className="input"
                                        disabled={formData.discountType === 'FLAT'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Min Order Value (₹)</label>
                                    <input
                                        type="number"
                                        value={formData.minOrderValue}
                                        onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                                        placeholder="199"
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Valid From</label>
                                    <input
                                        type="date"
                                        value={formData.validFrom}
                                        onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">Valid Until</label>
                                    <input
                                        type="date"
                                        value={formData.validUntil}
                                        onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                        className="input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Usage Limit</label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    placeholder="Leave empty for unlimited"
                                    className="input"
                                />
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-foreground">Active (can be used by customers)</span>
                            </label>
                        </div>
                        <div className="p-6 border-t border-border flex gap-3 justify-end">
                            <button onClick={() => setShowModal(false)} className="btn-secondary">
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} className="btn-primary">
                                {saving ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                                ) : (
                                    editingCoupon ? 'Save Changes' : 'Create Coupon'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
