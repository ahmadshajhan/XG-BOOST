import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    campaignSlug: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    device: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'unknown'],
        default: 'unknown',
    },
    source: {
        type: String,
        default: 'direct',
    },
    redirectUrl: {
        type: String,
        required: true,
    }
});

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
