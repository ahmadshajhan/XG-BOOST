import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const { slug, name, whatsappNumbers, baseMessage } = body;

        // Basic Validation
        if (!slug || !name || !whatsappNumbers || !Array.isArray(whatsappNumbers)) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields or invalid format' },
                { status: 400 }
            );
        }

        const campaign = await Campaign.create({
            slug,
            name,
            whatsappNumbers,
            baseMessage
        });

        return NextResponse.json({ success: true, data: campaign }, { status: 201 });
    } catch (error: any) {
        console.error('Create Campaign Error:', error);
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
