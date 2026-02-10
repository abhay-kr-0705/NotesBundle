'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    MoreVertical,
    User,
    Mail,
    Calendar,
    ShoppingBag,
    Shield,
    Ban,
    Check,
    Loader2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    totalOrders: number;
    totalSpent: number;
    createdAt: string;
    isActive: boolean;
    isVerified: boolean;
}

const roleColors: { [key: string]: string } = {
    ADMIN: 'bg-violet-100 text-violet-700',
    USER: 'bg-slate-100 text-slate-700',
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        // TODO: Implement API for toggling status
        // For now just update UI
        setUsers(users.map(u =>
            u.id === id ? { ...u, isActive: !u.isActive } : u
        ));
    };

    const changeRole = async (id: string, role: string) => {
        // TODO: Implement API for changing role
        // For now just update UI
        setUsers(users.map(u =>
            u.id === id ? { ...u, role } : u
        ));
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                <p className="text-muted-foreground">Manage registered users and their roles</p>
            </div>


            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Authenticated</p>
                    <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.isVerified).length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Admins</p>
                    <p className="text-2xl font-bold text-violet-600">{users.filter(u => u.role === 'ADMIN').length}</p>
                </div>
                <div className="card p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">₹{users.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                /* Users Table */
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-border">
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">User</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Contact</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Role</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Orders</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Total Spent</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Joined</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="p-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <span className="font-medium text-foreground">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="space-y-1">
                                                <p className="flex items-center gap-1 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    {user.email}
                                                </p>
                                                {user.phone && (
                                                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user.id, e.target.value)}
                                                className={`badge cursor-pointer ${roleColors[user.role]} border-0 text-sm`}
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1">
                                                <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                                                {user.totalOrders}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold">₹{user.totalSpent.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className="flex items-center gap-1 text-muted-foreground text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {user.createdAt}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleUserStatus(user.id, user.isActive)}
                                                className={`badge cursor-pointer ${user.isActive
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                {user.isActive ? (
                                                    <><Check className="w-3 h-3 mr-1" /> Active</>
                                                ) : (
                                                    <><Ban className="w-3 h-3 mr-1" /> Blocked</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="p-4 border-t border-border flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-medium">1-{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="btn-ghost px-3 py-1.5 text-sm" disabled>Previous</button>
                            <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-medium">1</button>
                            <button className="btn-ghost px-3 py-1.5 text-sm" disabled>Next</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
