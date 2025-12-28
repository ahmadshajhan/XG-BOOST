import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: [true, 'Please provide a slug'],
        unique: true,
        trim: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    whatsappNumbers: {
        type: [String],
        required: [true, 'Please provide at least one WhatsApp number'],
        validate: {
            validator: function (v: string[]) {
                return v && v.length > 0;
            },
            message: 'A campaign must have at least one number.'
        }
    },
    baseMessage: {
        type: String,
        default: "Hello!",
    },
    totalClicks: {
        type: Number,
        default: 0,
    },
    lastActiveIndex: {
        type: Number,
        default: -1, // Will increment to 0 on first use
    }
}, { timestamps: true });

export default mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
