'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const [settings, setSettings] = useState({
        siteName: 'NotesBundle',
        supportEmail: 'notesbundle@outlook.com',
        maintenanceMode: false,
        allowSignups: true,
    });

    // Fetch settings from API
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings({
                        siteName: data.siteName || 'NotesBundle',
                        supportEmail: data.supportEmail || '',
                        maintenanceMode: data.maintenanceMode === 'true',
                        allowSignups: data.allowSignups !== 'false',
                    });
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteName: settings.siteName,
                    supportEmail: settings.supportEmail,
                    maintenanceMode: String(settings.maintenanceMode),
                    allowSignups: String(settings.allowSignups),
                }),
            });

            if (res.ok) {
                toast.success('Settings saved successfully!');
            } else {
                toast.error('Failed to save settings');
            }
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage global application settings</p>
            </div>

            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
                <div className="card p-6 space-y-4">
                    <h2 className="font-semibold text-lg">General Settings</h2>

                    <div>
                        <label className="block text-sm font-medium mb-1">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Support Email</label>
                        <input
                            type="email"
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="input"
                        />
                    </div>
                </div>

                <div className="card p-6 space-y-4">
                    <h2 className="font-semibold text-lg">System Status</h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Maintenance Mode</p>
                            <p className="text-sm text-muted-foreground">Disable access for non-admin users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Allow Signups</p>
                            <p className="text-sm text-muted-foreground">Enable new user registration</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.allowSignups}
                                onChange={(e) => setSettings({ ...settings, allowSignups: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary flex items-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
