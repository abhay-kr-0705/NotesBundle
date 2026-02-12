import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_SETTINGS: { [key: string]: string } = {
    siteName: 'NotesBundle',
    supportEmail: 'support@notesbundle.com',
    maintenanceMode: 'false',
    allowSignups: 'true',
};

// GET all settings
export async function GET() {
    try {
        const dbSettings = await prisma.siteSetting.findMany();
        const settings: { [key: string]: string } = { ...DEFAULT_SETTINGS };
        for (const s of dbSettings) {
            settings[s.key] = s.value;
        }
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(DEFAULT_SETTINGS);
    }
}

// PUT update settings
export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Upsert each setting
        const updates = Object.entries(body).map(([key, value]) =>
            prisma.siteSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            })
        );

        await Promise.all(updates);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error saving settings:', error);
        return NextResponse.json(
            { error: 'Failed to save settings', details: error.message },
            { status: 500 }
        );
    }
}
