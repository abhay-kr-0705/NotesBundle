import {
    TrendingUp,
    TrendingDown,
    Eye,
    Download,
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { getAnalyticsData } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
    const data = await getAnalyticsData();

    const overviewStats = [
        {
            title: 'Page Views',
            value: data.views.toLocaleString(),
            change: '+0%', // Placeholder
            trend: 'up',
            period: 'Total'
        },
        {
            title: 'Total Users', // Replacing Unique Visitors for now as we don't track unique IPs persistently in a way that matches
            value: data.users.toLocaleString(),
            change: '+0%',
            trend: 'up',
            period: 'Total'
        },
        {
            title: 'Total Downloads',
            value: data.downloads.toLocaleString(),
            change: '+0%',
            trend: 'up',
            period: 'Total'
        },
        {
            title: 'Total Orders', // Replacing Conversion Rate for simplicity or we calculate it
            value: data.orders.toLocaleString(),
            change: '+0%',
            trend: 'up',
            period: 'Total'
        },
    ];

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                    <p className="text-muted-foreground">Track your store performance and traffic</p>
                </div>
                <div className="flex gap-3">
                    {/* <select className="input w-auto">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                    </select> */}
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {overviewStats.map((stat, index) => (
                    <div key={index} className="card p-5">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            </div>
                            {/* <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${stat.trend === 'up'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </span> */}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{stat.period}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Traffic Chart */}
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Traffic Overview (Last 7 Days)</h2>
                    <div className="h-64 flex items-end justify-between gap-2">
                        {data.dailyAnalytics.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                                <p className="text-muted-foreground">No traffic data yet. Views will appear as users visit your site.</p>
                            </div>
                        ) : (
                            data.dailyAnalytics.map((day, i) => {
                                const maxViews = Math.max(...data.dailyAnalytics.map(d => d.totalViews), 1);
                                const height = (day.totalViews / maxViews) * 100;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group">
                                        <div
                                            className="w-full max-w-[40px] bg-blue-500/80 rounded-t-md hover:bg-blue-500 transition-all relative"
                                            style={{ height: `${height}%`, minHeight: '4px' }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {day.totalViews} views
                                            </div>
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-2">{new Date(day.date).getDate()}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>


                {/* Revenue Chart */}
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Daily Analytics</h2>
                    <div className="h-64 flex items-end justify-center">
                        {data.dailyAnalytics.length === 0 ? (
                            <p className="text-muted-foreground">No daily analytics records found.</p>
                        ) : (
                            <div className="w-full h-full flex items-end gap-2">
                                {data.dailyAnalytics.map((day, i) => (
                                    <div key={i} className="text-center flex-1">
                                        <div
                                            className="bg-primary/20 rounded-t mx-auto hover:bg-primary/40 transition-colors"
                                            style={{
                                                width: '80%',
                                                height: `${(day.totalViews / Math.max(...data.dailyAnalytics.map(d => d.totalViews), 1)) * 100}%`,
                                                minHeight: '4px'
                                            }}
                                            title={`${day.totalViews} views`}
                                        ></div>
                                        <p className="text-xs text-muted-foreground mt-1">{new Date(day.date).getDate()}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="card">
                    <div className="p-6 border-b border-border">
                        <h2 className="font-semibold text-foreground">Top Pages</h2>
                    </div>
                    <div className="divide-y divide-border">
                        {data.topPages.length === 0 ? (
                            <p className="p-6 text-center text-muted-foreground">No page views yet.</p>
                        ) : (
                            data.topPages.map((page, index) => (
                                <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-6 bg-secondary rounded flex items-center justify-center text-sm font-medium text-muted-foreground">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-foreground truncate max-w-[200px]" title={page.title}>{page.title}</span>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <span className="flex items-center gap-1 text-muted-foreground">
                                            <Eye className="w-4 h-4" />
                                            {page.viewCount.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1 text-muted-foreground" title="Unique Visitors">
                                            <Users className="w-4 h-4" />
                                            {page.uniqueVisitors.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="card">
                    <div className="p-6 border-b border-border">
                        <h2 className="font-semibold text-foreground">Top Referrers</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {data.trafficSources.length === 0 ? (
                            <p className="text-center text-muted-foreground">No traffic source data yet.</p>
                        ) : (
                            data.trafficSources.map((source, index) => (
                                <div key={index}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-foreground">{source.referrer || 'Direct / Unknown'}</span>
                                        <span className="text-muted-foreground">{source._count.referrer.toLocaleString()} visits</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{
                                                width: `${(source._count.referrer / Math.max(...data.trafficSources.map(s => s._count.referrer), 1)) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
