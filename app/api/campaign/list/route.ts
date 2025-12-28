import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campaign from '@/models/Campaign';

export async function GET() {
    try {
        await dbConnect();
        const campaigns = await Campaign.find().sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: campaigns }, { status: 200 });
    } catch (error: any) {
        console.error('Get Campaigns Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
