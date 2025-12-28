import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import Lead from '@/models/Lead';
import { generateDynamicMessage } from '@/lib/ai';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');
        const intent = searchParams.get('intent') || '';
        const device = searchParams.get('device') || 'unknown';

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
        }

        await dbConnect();

        // 1. Fetch & Atomically Increment (Anti-Ban Logic)
        // We use findOneAndUpdate to atomically increment totalClicks.
        // Then we use (totalClicks % length) to determine the index.
        // This guarantees round-robin distribution even with concurrent requests.
        const campaign = await Campaign.findOneAndUpdate(
            { slug },
            { $inc: { totalClicks: 1 } },
            { new: true } // Return updated document
        );

        if (!campaign) {
            return NextResponse.json({ success: false, error: 'Campaign not found' }, { status: 404 });
        }

        if (!campaign.whatsappNumbers || campaign.whatsappNumbers.length === 0) {
            return NextResponse.json({ success: false, error: 'Configuration Error: No numbers' }, { status: 500 });
        }

        // Calculate index based on the atomic counter
        // (totalClicks - 1) because we just incremented it. 
        // Or just totalClicks % length. 
        // Let's use (totalClicks - 1) so the first click (1) gives index 0.
        const nextIndex = (campaign.totalClicks - 1) % campaign.whatsappNumbers.length;
        const selectedNumber = campaign.whatsappNumbers[nextIndex];

        // 3. AI Message Generation
        const aiMessage = await generateDynamicMessage(campaign.baseMessage, intent);
        const encodedMessage = encodeURIComponent(aiMessage);
        const finalUrl = `https://wa.me/${selectedNumber}?text=${encodedMessage}`;

        // 4. Analytics Logging
        await Lead.create({
            campaignSlug: slug,
            device,
            redirectUrl: finalUrl
        });

        return NextResponse.json({
            success: true,
            targetUrl: finalUrl,
            debug: {
                numberIndex: nextIndex,
                totalNumbers: campaign.whatsappNumbers.length,
                totalClicks: campaign.totalClicks
            }
        });

    } catch (error: any) {
        console.error('Redirect Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
