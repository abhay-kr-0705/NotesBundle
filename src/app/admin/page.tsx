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
} from 'lucide-react';
import { getDashboardStats } from '@/lib/admin';
import RefreshAnalytics from '@/components/admin/RefreshAnalytics';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const data = await getDashboardStats();

    const stats = [
        {
            title: 'Total Revenue',
            value: `₹${data.revenue.toLocaleString()}`,
            change: '+0%', // Placeholder for now or calculate if needed
            trend: 'up',
            icon: DollarSign,
            color: 'bg-emerald-500',
        },
        {
            title: 'Total Orders',
            value: data.orders.toLocaleString(),
            change: '+0%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'bg-blue-500',
        },
        {
            title: 'Total Users',
            value: data.users.toLocaleString(),
            change: '+0%',
            trend: 'up',
            icon: Users,
            color: 'bg-violet-500',
        },
        {
            title: 'Total Notes',
            value: data.notes.toLocaleString(),
            change: '+0%',
            trend: 'up',
            icon: BookOpen,
            color: 'bg-amber-500',
        },
    ];

    const statusColors: { [key: string]: string } = {
        COMPLETED: 'bg-emerald-100 text-emerald-700',
        PAID: 'bg-emerald-100 text-emerald-700',
        PENDING: 'bg-amber-100 text-amber-700',
        FAILED: 'bg-red-100 text-red-700',
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
                </div>
                <RefreshAnalytics />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="card p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            {/* <span className={`flex items-center gap-1 text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                                }`}>
                                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                {stat.change}
                            </span> */}
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
                                {data.recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet</td>
                                    </tr>
                                ) : (
                                    data.recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                                            <td className="p-4 font-medium text-primary text-xs font-mono">{order.id.slice(-6).toUpperCase()}</td>
                                            <td className="p-4">
                                                <p className="font-medium text-foreground">{order.user?.name || 'Unknown'}</p>
                                                <p className="text-sm text-muted-foreground">{order.user?.email}</p>
                                            </td>
                                            <td className="p-4 font-semibold">₹{order.finalAmount}</td>
                                            <td className="p-4">
                                                <span className={`badge ${statusColors[order.status] || 'bg-slate-100'} capitalize`}>
                                                    {order.status.toLowerCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground text-sm">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                        {data.topNotes.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No notes found</p>
                        ) : (
                            data.topNotes.map((note, index) => (
                                <div key={note.id} className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-secondary rounded-md flex items-center justify-center text-sm font-semibold text-muted-foreground">
                                        {index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">{note.title}</p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" /> {note.viewCount.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Download className="w-3.5 h-3.5" /> {note.downloadCount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-foreground text-sm">
                                        {note.price > 0 ? `₹${note.price}` : 'Free'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Stats Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Revenue Overview (Last 7 Days)</h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.dailyRevenue.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                                <p className="text-muted-foreground">No revenue data yet</p>
                            </div>
                        ) : (
                            // Simple Bar Chart Visualization
                            // Group orders by day first
                            (() => {
                                const days = Array.from({ length: 7 }, (_, i) => {
                                    const d = new Date();
                                    d.setDate(d.getDate() - 6 + i); // Last 7 days including today
                                    return d.toISOString().split('T')[0];
                                });

                                const grouped = data.dailyRevenue.reduce((acc: any, order) => {
                                    const date = new Date(order.createdAt).toISOString().split('T')[0];
                                    acc[date] = (acc[date] || 0) + order.finalAmount;
                                    return acc;
                                }, {});

                                const maxVal = Math.max(...Object.values(grouped).map(v => Number(v)), 1) as number;

                                return days.map(day => {
                                    const val = grouped[day] || 0;
                                    const height = (val / maxVal) * 100;
                                    return (
                                        <div key={day} className="flex-1 flex flex-col items-center justify-end h-full group">
                                            <div className="w-full max-w-[40px] bg-emerald-500/80 rounded-t-md hover:bg-emerald-500 transition-all relative" style={{ height: `${height}%`, minHeight: '4px' }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    ₹{val}
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground mt-2">{new Date(day).getDate()}</span>
                                        </div>
                                    );
                                });
                            })()
                        )}
                    </div>
                </div>
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Traffic Overview (Last 7 Days)</h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {Object.keys(data.dailyTraffic).length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                                <p className="text-muted-foreground">No traffic data yet</p>
                            </div>
                        ) : (
                            (() => {
                                const days = Array.from({ length: 7 }, (_, i) => {
                                    const d = new Date();
                                    d.setDate(d.getDate() - 6 + i);
                                    return d.toISOString().split('T')[0];
                                });

                                const maxVal = Math.max(...Object.values(data.dailyTraffic).map(v => Number(v)), 1) as number;

                                return days.map(day => {
                                    const val = data.dailyTraffic[day] || 0;
                                    const height = (val / maxVal) * 100;
                                    return (
                                        <div key={day} className="flex-1 flex flex-col items-center justify-end h-full group">
                                            <div className="w-full max-w-[40px] bg-blue-500/80 rounded-t-md hover:bg-blue-500 transition-all relative" style={{ height: `${height}%`, minHeight: '4px' }}>
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {val} views
                                                </div>
                                            </div>
                                            <span className="text-xs text-muted-foreground mt-2">{new Date(day).getDate()}</span>
                                        </div>
                                    );
                                });
                            })()
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}

