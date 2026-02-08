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

// Sample analytics data
const overviewStats = [
    {
        title: 'Page Views',
        value: '125,430',
        change: '+12.5%',
        trend: 'up',
        period: 'vs last month'
    },
    {
        title: 'Unique Visitors',
        value: '45,678',
        change: '+8.3%',
        trend: 'up',
        period: 'vs last month'
    },
    {
        title: 'Total Downloads',
        value: '12,345',
        change: '+15.7%',
        trend: 'up',
        period: 'vs last month'
    },
    {
        title: 'Conversion Rate',
        value: '3.2%',
        change: '-0.4%',
        trend: 'down',
        period: 'vs last month'
    },
];

const topPages = [
    { path: '/notes/gate-cse-2024', views: 15234, uniqueVisitors: 12456 },
    { path: '/notes/beu-sem-3', views: 8923, uniqueVisitors: 7234 },
    { path: '/category/competitive', views: 7845, uniqueVisitors: 6123 },
    { path: '/notes/python-notes', views: 6543, uniqueVisitors: 5432 },
    { path: '/notes/ssc-cgl-prep', views: 5678, uniqueVisitors: 4567 },
];

const trafficSources = [
    { source: 'Google Search', visits: 45678, percentage: 52 },
    { source: 'Direct', visits: 23456, percentage: 27 },
    { source: 'Social Media', visits: 12345, percentage: 14 },
    { source: 'Referral', visits: 6123, percentage: 7 },
];

const dailyStats = [
    { date: 'Jan 15', views: 4523, revenue: 12340 },
    { date: 'Jan 14', views: 4234, revenue: 9870 },
    { date: 'Jan 13', views: 3987, revenue: 8450 },
    { date: 'Jan 12', views: 4567, revenue: 15230 },
    { date: 'Jan 11', views: 3876, revenue: 7890 },
    { date: 'Jan 10', views: 4123, revenue: 11230 },
    { date: 'Jan 09', views: 3654, revenue: 6780 },
];

export default function AdminAnalyticsPage() {
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
                    <p className="text-muted-foreground">Track your store performance and traffic</p>
                </div>
                <div className="flex gap-3">
                    <select className="input w-auto">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 3 months</option>
                        <option>Last year</option>
                    </select>
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
                            <span className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${stat.trend === 'up'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{stat.period}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Traffic Chart */}
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Traffic Overview</h2>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <Eye className="w-10 h-10 text-primary/30 mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm">Traffic chart visualization</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mt-4">
                        {dailyStats.map((day, i) => (
                            <div key={i} className="text-center">
                                <div
                                    className="bg-primary/20 rounded-t mx-auto"
                                    style={{
                                        width: '100%',
                                        height: `${(day.views / 5000) * 60}px`,
                                        minHeight: '20px'
                                    }}
                                ></div>
                                <p className="text-xs text-muted-foreground mt-1">{day.date.split(' ')[1]}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Revenue Chart */}
                <div className="card p-6">
                    <h2 className="font-semibold text-foreground mb-4">Revenue Overview</h2>
                    <div className="h-64 bg-gradient-to-br from-emerald-50 to-slate-50 rounded-xl flex items-center justify-center">
                        <div className="text-center">
                            <DollarSign className="w-10 h-10 text-emerald-500/30 mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm">Revenue chart visualization</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2 mt-4">
                        {dailyStats.map((day, i) => (
                            <div key={i} className="text-center">
                                <div
                                    className="bg-emerald-500/20 rounded-t mx-auto"
                                    style={{
                                        width: '100%',
                                        height: `${(day.revenue / 16000) * 60}px`,
                                        minHeight: '20px'
                                    }}
                                ></div>
                                <p className="text-xs text-muted-foreground mt-1">{day.date.split(' ')[1]}</p>
                            </div>
                        ))}
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
                        {topPages.map((page, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-secondary rounded flex items-center justify-center text-sm font-medium text-muted-foreground">
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-foreground truncate max-w-[200px]">{page.path}</span>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Eye className="w-4 h-4" />
                                        {page.views.toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        {page.uniqueVisitors.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="card">
                    <div className="p-6 border-b border-border">
                        <h2 className="font-semibold text-foreground">Traffic Sources</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {trafficSources.map((source, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-foreground">{source.source}</span>
                                    <span className="text-muted-foreground">{source.visits.toLocaleString()} visits</span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${source.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
