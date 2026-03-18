import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },

    title: { type: String, default: 'Untitled Resume' },
    public: { type: Boolean, default: false },
    template: { type: String, default: "classic" },
    accentColor: { type: String, default: '#3B82F6' },

    professionalSummary: { type: String, default: '' },

    skills: [{ type: String, default: '' }],

    personalInfo: {
        image: { type: String, default: '' },
        fullName: { type: String, default: '' },
        profession: { type: String, default: '' },
        email: { 
            type: String, 
            default: '',
            match: [/^\S+@\S+\.\S+$/, 'Invalid email']
        },
        phone: { type: String, default: '' },
        location: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        website: { type: String, default: '' },
    },

    experience: [
        {
            company: { type: String, default: '' },
            position: { type: String, default: '' },
            startDate: { type: String, default: '' },
            endDate: { type: String, default: '' },
            description: { type: String, default: '' },
            isCurrent: { type: Boolean, default: false },
        }
    ],

    projects: [
        {
            name: { type: String, default: '' },
            type: { type: String, default: '' },
            description: { type: String, default: '' },
        }
    ],

    education: [
        {
            institution: { type: String, default: '' },
            degree: { type: String, default: '' },
            field: { type: String, default: '' },
            graduationDate: { type: String, default: '' },
            gpa: { type: String, default: '' },
        }
    ],

}, { timestamps: true, minimize: false });

ResumeSchema.index({ userId: 1 });

const Resume = mongoose.model('Resume', ResumeSchema);

export default Resume;