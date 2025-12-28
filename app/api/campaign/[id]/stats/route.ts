import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import mongoose from 'mongoose';
import Campaign from '@/models/Campaign';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        // Verify campaign exists first
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
        }

        // Aggregation for clicks over time (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Note: We are querying by 'campaignSlug' in Lead, but we have 'id'. 
        // We should probably match by slug. Let's consistency check.
        // Campaign model has slug. Lead model has campaignSlug.
        // So we use campaign.slug to query Leads.

        const dailyClicks = await Lead.aggregate([
            {
                $match: {
                    campaignSlug: campaign.slug,
                    timestamp: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const deviceStats = await Lead.aggregate([
            { $match: { campaignSlug: campaign.slug } },
            { $group: { _id: "$device", count: { $sum: 1 } } }
        ]);

        return NextResponse.json({
            success: true,
            dailyClicks,
            deviceStats
        });
    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
