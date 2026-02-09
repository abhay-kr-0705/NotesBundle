'use client';

import { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    // Placeholder settings for now
    const [settings, setSettings] = useState({
        siteName: 'NotesBundle',
        supportEmail: 'support@notesbundle.com',
        maintenanceMode: false,
        allowSignups: true,
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        alert('Settings saved successfully!');
    };

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
