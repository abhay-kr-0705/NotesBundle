'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Search,
    Filter,
    Download,
    Eye,
    ChevronDown
} from 'lucide-react';

// Sample orders data
const sampleOrders = [
    {
        id: 'ORD-001',
        customer: 'Rahul Kumar',
        email: 'rahul@email.com',
        phone: '*********',
        items: [
            { title: 'Complete GATE CSE Notes 2024', price: 199 },
        ],
        totalAmount: 199,
        paymentId: 'pay_OxYz123456',
        status: 'completed',
        createdAt: '2024-01-15 14:30'
    },
    {
        id: 'ORD-002',
        customer: 'Priya Singh',
        email: 'priya@email.com',
        phone: '*********',
        items: [
            { title: 'GATE ECE Notes 2024', price: 249 },
            { title: 'Engineering Handbook', price: 50 },
        ],
        totalAmount: 299,
        paymentId: 'pay_AbCd789012',
        status: 'completed',
        createdAt: '2024-01-15 12:15'
    },
    {
        id: 'ORD-003',
        customer: 'Amit Verma',
        email: 'amit@email.com',
        phone: '*********',
        items: [
            { title: 'Python Programming Notes', price: 99 },
        ],
        totalAmount: 99,
        paymentId: null,
        status: 'pending',
        createdAt: '2024-01-14 18:45'
    },
    {
        id: 'ORD-004',
        customer: 'Neha Sharma',
        email: 'neha@email.com',
        phone: '*********',
        items: [
            { title: 'BEU 3rd Semester Notes', price: 199 },
            { title: 'DSA Handwritten Notes', price: 149 },
            { title: 'DBMS Quick Revision', price: 49 },
        ],
        totalAmount: 397,
        paymentId: 'pay_EfGh345678',
        status: 'completed',
        createdAt: '2024-01-14 10:20'
    },
    {
        id: 'ORD-005',
        customer: 'Vikash Yadav',
        email: 'vikash@email.com',
        phone: '*********',
        items: [
            { title: 'UPSC Complete Guide', price: 399 },
        ],
        totalAmount: 399,
        paymentId: null,
        status: 'failed',
        createdAt: '2024-01-13 16:00'
    },
];

const statusColors: { [key: string]: string } = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-slate-100 text-slate-700',
};

export default function AdminOrdersPage() {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const totalRevenue = sampleOrders
        .filter(o => o.status === 'completed')
        .reduce((sum, o) => sum + o.totalAmount, 0);

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Orders & Sales</h1>
                    <p className="text-muted-foreground">Track all payments and order history</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-foreground">{sampleOrders.length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-emerald-600">{sampleOrders.filter(o => o.status === 'completed').length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">{sampleOrders.filter(o => o.status === 'pending').length}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by order ID, customer name, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select className="input w-auto">
                            <option>All Status</option>
                            <option>Completed</option>
                            <option>Pending</option>
                            <option>Failed</option>
                            <option>Refunded</option>
                        </select>
                        <input type="date" className="input w-auto" />
                        <input type="date" className="input w-auto" />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50 border-b border-border">
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Order ID</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Customer</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Items</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Payment ID</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Date</th>
                                <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sampleOrders.map((order) => (
                                <>
                                    <tr key={order.id} className="border-b border-border hover:bg-slate-50">
                                        <td className="p-4">
                                            <button
                                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                                className="font-medium text-primary flex items-center gap-1"
                                            >
                                                {order.id}
                                                <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-medium text-foreground">{order.customer}</p>
                                            <p className="text-sm text-muted-foreground">{order.email}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-muted-foreground">{order.items.length} item(s)</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-semibold text-foreground">₹{order.totalAmount}</span>
                                        </td>
                                        <td className="p-4">
                                            {order.paymentId ? (
                                                <span className="text-sm font-mono text-muted-foreground">{order.paymentId}</span>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`badge capitalize ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground text-sm">{order.createdAt}</td>
                                        <td className="p-4">
                                            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedOrder === order.id && (
                                        <tr className="bg-slate-50">
                                            <td colSpan={8} className="p-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-2">Order Items</h4>
                                                        <div className="space-y-2">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between text-sm">
                                                                    <span>{item.title}</span>
                                                                    <span className="font-medium">₹{item.price}</span>
                                                                </div>
                                                            ))}
                                                            <div className="border-t border-border pt-2 flex justify-between font-semibold">
                                                                <span>Total</span>
                                                                <span>₹{order.totalAmount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-foreground mb-2">Customer Details</h4>
                                                        <div className="text-sm space-y-1">
                                                            <p><span className="text-muted-foreground">Name:</span> {order.customer}</p>
                                                            <p><span className="text-muted-foreground">Email:</span> {order.email}</p>
                                                            <p><span className="text-muted-foreground">Phone:</span> {order.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium">1-{sampleOrders.length}</span> of <span className="font-medium">{sampleOrders.length}</span> orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="btn-ghost px-3 py-1.5 text-sm" disabled>Previous</button>
                        <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-medium">1</button>
                        <button className="btn-ghost px-3 py-1.5 text-sm" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
