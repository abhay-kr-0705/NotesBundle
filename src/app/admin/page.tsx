import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    BookOpen,
    ShoppingCart,
    Users,
    DollarSign,
    Eye,
    Download,
    ArrowRight,
    MoreVertical
} from 'lucide-react';

// Sample analytics data (will be replaced with database query)
const stats = [
    {
        title: 'Total Revenue',
        value: '₹1,25,430',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'bg-emerald-500',
    },
    {
        title: 'Total Orders',
        value: '1,234',
        change: '+8.2%',
        trend: 'up',
        icon: ShoppingCart,
        color: 'bg-blue-500',
    },
    {
        title: 'Total Users',
        value: '5,678',
        change: '+15.3%',
        trend: 'up',
        icon: Users,
        color: 'bg-violet-500',
    },
    {
        title: 'Total Notes',
        value: '156',
        change: '+3',
        trend: 'up',
        icon: BookOpen,
        color: 'bg-amber-500',
    },
];

const recentOrders = [
    { id: 'ORD-001', customer: 'Rahul Kumar', email: 'rahul@email.com', amount: 199, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Priya Singh', email: 'priya@email.com', amount: 299, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Amit Verma', email: 'amit@email.com', amount: 149, status: 'pending', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Neha Sharma', email: 'neha@email.com', amount: 399, status: 'completed', date: '2024-01-14' },
    { id: 'ORD-005', customer: 'Vikash Yadav', email: 'vikash@email.com', amount: 199, status: 'failed', date: '2024-01-13' },
];

const topNotes = [
    { id: '1', title: 'Complete GATE CSE Notes 2024', views: 15234, downloads: 1520, revenue: 30380 },
    { id: '2', title: 'BEU 3rd Semester All Subjects', views: 8923, downloads: 890, revenue: 17711 },
    { id: '3', title: 'SSC CGL Complete Preparation', views: 23456, downloads: 2340, revenue: 0 },
    { id: '4', title: 'Python Programming Notes', views: 11023, downloads: 1100, revenue: 10890 },
    { id: '5', title: 'GATE ECE Previous Year Papers', views: 18934, downloads: 1890, revenue: 33831 },
];

const statusColors: { [key: string]: string } = {
    completed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="card p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 card">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                                        <td className="p-4 font-medium text-primary">{order.id}</td>
                                        <td className="p-4">
                                            <p className="font-medium text-foreground">{order.customer}</p>
                                            <p className="text-sm text-muted-foreground">{order.email}</p>
                                        </td>
                                        <td className="p-4 font-semibold">₹{order.amount}</td>
                                        <td className="p-4">
                                            <span className={`badge ${statusColors[order.status]} capitalize`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Performing Notes */}
                <div className="card">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h2 className="font-semibold text-foreground">Top Notes</h2>
                        <Link href="/admin/notes" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="p-4 space-y-4">
                        {topNotes.map((note, index) => (
                            <div key={note.id} className="flex items-start gap-3">
                                <span className="w-6 h-6 bg-secondary rounded-md flex items-center justify-center text-sm font-semibold text-muted-foreground">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-foreground truncate">{note.title}</p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" /> {note.views.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Download className="w-3.5 h-3.5" /> {note.downloads.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <p className="font-semibold text-foreground">
                                    {note.revenue > 0 ? `₹${note.revenue.toLocaleString()}` : 'Free'}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats Chart Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Revenue Overview</h2>
                    <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center">
                        <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                    </div>
                </div>
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Traffic Overview</h2>
                    <div className="h-64 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl flex items-center justify-center">
                        <p className="text-muted-foreground">Traffic chart will be displayed here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
