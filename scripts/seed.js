import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { Lead } from "../models/Lead.js";
import { Employee } from "../models/Employee.js";
import { CallLog } from "../models/CallLog.js";
import { EmailLog } from "../models/EmailLog.js";
import { Media } from "../models/Media.js";

dotenv.config();

export const INITIAL_SAMPLE_LEADS = [
  {
    id: "lead-1001",
    fullName: "Rajesh Kumar Verma",
    phone: "+91 98490 12345",
    email: "rajesh.verma@techcorp.in",
    preferredMethod: "WhatsApp",
    source: "Website Enquiry",
    message: "Interested in 300 SQ YD East Facing 4BHK Villa with private lift. Requesting weekend site visit.",
    status: "Site Visit Scheduled",
    unitInterest: "300 SQ YD Villa (East Facing)",
    budget: "₹4.5 Cr - ₹5.5 Cr",
    assignedToId: "emp-102",
    assignedToName: "Rahul Varma",
    notes: "Scheduled site visit with family for Saturday 11:00 AM. Assigned to senior consultant Rahul.",
    followUpDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
  },
  {
    id: "lead-1002",
    fullName: "Dr. Snigdha Reddy",
    phone: "+91 98855 67890",
    email: "dr.snigdha.reddy@apollohealth.org",
    preferredMethod: "Phone",
    source: "Brochure Download",
    message: "Downloaded digital project kit. Want pricing sheet and bank approval list for HDFC/SBI.",
    status: "New",
    unitInterest: "222 SQ YD Villa (West Facing)",
    budget: "₹3.8 Cr - ₹4.5 Cr",
    assignedToId: "emp-101",
    assignedToName: "Kavitha Ramanathan",
    notes: "First touchpoint pending. Needs pricing breakdown and floor plan PDF on WhatsApp.",
    followUpDate: new Date().toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
  },
  {
    id: "lead-1003",
    fullName: "Venkata Satyanarayana",
    phone: "+91 94401 88990",
    email: "v.satya@gmrinfra.com",
    preferredMethod: "Phone",
    source: "Website Enquiry",
    message: "Looking for luxury gated community near ORR Exit 12 / Shamshabad connectivity.",
    status: "Contacted",
    unitInterest: "300 SQ YD Villa (West Facing)",
    budget: "₹5.0 Cr+",
    assignedToId: "emp-102",
    assignedToName: "Rahul Varma",
    notes: "Spoke on call. Liked the 90,000 sq ft clubhouse & 4.5 acre central park. Will visit after Dussehra.",
    followUpDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
  },
  {
    id: "lead-1004",
    fullName: "Ananya & Rohit Sharma",
    phone: "+91 97000 45612",
    email: "rohit.sharma@microsoft.com",
    preferredMethod: "WhatsApp",
    source: "Direct WhatsApp CTA",
    message: "NRI enquiry from Seattle, parents living in Hyderabad. Require virtual 3D tour link.",
    status: "Negotiation",
    unitInterest: "300 SQ YD Villa (East Facing Corner)",
    budget: "₹5.5 Cr",
    assignedToId: "emp-103",
    assignedToName: "Pooja Deshmukh",
    notes: "Virtual walkthrough conducted via Zoom. Pricing discussion in progress with Sales Director.",
    followUpDate: new Date(Date.now() + 12 * 3600 * 1000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000),
  },
  {
    id: "lead-1005",
    fullName: "K. S. Rao",
    phone: "+91 99890 22334",
    email: "ksrao.investments@gmail.com",
    preferredMethod: "Phone",
    source: "Brochure Download",
    message: "Seeking 2 contiguous villa units for joint family living.",
    status: "Converted",
    unitInterest: "2x 222 SQ YD Villas",
    budget: "₹8.0 Cr",
    assignedToId: "emp-102",
    assignedToName: "Rahul Varma",
    notes: "Token advance received for Villa #42 & #43. Agreement of sale drafting initiated.",
    followUpDate: "",
    createdAt: new Date(Date.now() - 96 * 3600 * 1000),
  },
];

export const INITIAL_EMPLOYEES = [
  {
    id: "emp-101",
    name: "Kavitha Ramanathan",
    email: "kavitha.marketing@maytri.com",
    password: "emp123",
    role: "employee",
    department: "Digital Marketing & Growth",
    designation: "Marketing Lead & Campaign Manager",
    phone: "+91 98491 55678",
    status: "Active",
    avatar: "👩‍💼",
    dailyCallTarget: 30,
    dailyEmailTarget: 25,
  },
  {
    id: "emp-102",
    name: "Rahul Varma",
    email: "rahul.sales@maytri.com",
    password: "emp123",
    role: "employee",
    department: "Telecalling & Direct Sales",
    designation: "Senior Telecalling Specialist",
    phone: "+91 98765 43210",
    status: "Active",
    avatar: "👨‍💼",
    dailyCallTarget: 45,
    dailyEmailTarget: 20,
  },
  {
    id: "emp-103",
    name: "Pooja Deshmukh",
    email: "pooja.outreach@maytri.com",
    password: "emp123",
    role: "employee",
    department: "NRI & Luxury Sales",
    designation: "Client Relationship Manager",
    phone: "+91 99123 77889",
    status: "Active",
    avatar: "👩‍💻",
    dailyCallTarget: 25,
    dailyEmailTarget: 35,
  },
];

export const INITIAL_CALL_LOGS = [
  {
    id: "call-101",
    leadId: "lead-1001",
    leadName: "Rajesh Kumar Verma",
    leadPhone: "+91 98490 12345",
    employeeId: "emp-102",
    employeeName: "Rahul Varma",
    employeeDept: "Telecalling & Direct Sales",
    outcome: "Site Visit Confirmed",
    duration: "4 mins 20 secs",
    durationSec: 260,
    notes: "Client is interested in 300 SQ YD East Facing 4BHK. Confirmed site visit for Saturday 11:00 AM with his family.",
    timestamp: new Date(Date.now() - 1 * 3600 * 1000),
  },
  {
    id: "call-102",
    leadId: "lead-1002",
    leadName: "Dr. Snigdha Reddy",
    leadPhone: "+91 98855 67890",
    employeeId: "emp-101",
    employeeName: "Kavitha Ramanathan",
    employeeDept: "Digital Marketing & Growth",
    outcome: "Connected - Interested",
    duration: "5 mins 10 secs",
    durationSec: 310,
    notes: "Requested complete pricing sheet and bank approval details for 222 SQ YD Villa.",
    timestamp: new Date(Date.now() - 3 * 3600 * 1000),
  },
];

export const INITIAL_EMAIL_LOGS = [
  {
    id: "mail-201",
    leadId: "lead-1001",
    leadName: "Rajesh Kumar Verma",
    leadEmail: "rajesh.verma@techcorp.in",
    employeeId: "emp-102",
    employeeName: "Rahul Varma",
    templateType: "Site Visit Pass & Route Guide",
    subject: "Confirmation: Your VIP Site Visit at Maytri Ambhuja (Saturday 11:00 AM)",
    preview: "Dear Mr. Verma, we look forward to hosting you and your family at Maytri Ambhuja Luxury Township. Attached is your digital visitor pass & Google Maps location.",
    status: "Delivered",
    sentAt: new Date(Date.now() - 50 * 60 * 1000),
  },
];

export const INITIAL_MEDIA = [
  {
    key: "logo",
    title: "Maytri Ambhuja Brand Logo",
    category: "logo",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786505/maytri_ambhuja/brand/ambhuja_logo.png",
    publicId: "ambhuja_logo",
    resourceType: "image",
  },
  {
    key: "heroPoster",
    title: "Hero Background Poster",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786507/maytri_ambhuja/brand/hero_poster.jpg",
    publicId: "hero_poster",
    resourceType: "image",
  },
  {
    key: "heroBgImage",
    title: "Hero Background Image",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786507/maytri_ambhuja/brand/hero_poster.jpg",
    publicId: "hero_poster",
    resourceType: "image",
  },
  {
    key: "ctaPoster",
    title: "CTA Background Poster",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786509/maytri_ambhuja/brand/cta_poster.jpg",
    publicId: "cta_poster",
    resourceType: "image",
  },
  {
    key: "ctaBgImage",
    title: "CTA Background Image",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786509/maytri_ambhuja/brand/cta_poster.jpg",
    publicId: "cta_poster",
    resourceType: "image",
  },
  {
    key: "heroVideo",
    title: "Maytri Ambhuja Hero Video",
    category: "video",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/video/upload/maytri_ambhuja/videos/hero_video.mp4",
    publicId: "hero_video",
    resourceType: "video",
  },
  {
    key: "ctaVideo",
    title: "Maytri Ambhuja CTA Video",
    category: "video",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/video/upload/maytri_ambhuja/videos/cta_video.mp4",
    publicId: "cta_video",
    resourceType: "video",
  },
  {
    key: "gallery001",
    title: "Grand Clubhouse Architecture",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786512/maytri_ambhuja/gallery/gallery_001.jpg",
    publicId: "gallery_001",
    resourceType: "image",
  },
  {
    key: "gallery002",
    title: "Resort Style Temperature-Controlled Infinity Pool",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786514/maytri_ambhuja/gallery/gallery_002.jpg",
    publicId: "gallery_002",
    resourceType: "image",
  },
  {
    key: "gallery003",
    title: "Holistic Wellness Spa & Steam Pavilion",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786516/maytri_ambhuja/gallery/gallery_003.jpg",
    publicId: "gallery_003",
    resourceType: "image",
  },
  {
    key: "gallery004",
    title: "500-Guest Double-Height Grand Celebration Banquet",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786517/maytri_ambhuja/gallery/gallery_004.jpg",
    publicId: "gallery_004",
    resourceType: "image",
  },
  {
    key: "gallery005",
    title: "Indoor International Multi-Sport Arena",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786519/maytri_ambhuja/gallery/gallery_005.jpg",
    publicId: "gallery_005",
    resourceType: "image",
  },
  {
    key: "gallery006",
    title: "Boutique Executive Air-Conditioned Guest Suites",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786520/maytri_ambhuja/gallery/gallery_006.jpg",
    publicId: "gallery_006",
    resourceType: "image",
  },
  {
    key: "gallery007",
    title: "Children's Creative Activity Creche & Play Zone",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786522/maytri_ambhuja/gallery/gallery_007.jpg",
    publicId: "gallery_007",
    resourceType: "image",
  },
  {
    key: "gallery008",
    title: "Private 4K Dolby Atmos Acoustic Preview Theatre",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786523/maytri_ambhuja/gallery/gallery_008.jpg",
    publicId: "gallery_008",
    resourceType: "image",
  },
  {
    key: "gallery009",
    title: "State-of-the-Art Technogym Fitness Center",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786525/maytri_ambhuja/gallery/gallery_009.jpg",
    publicId: "gallery_009",
    resourceType: "image",
  },
  {
    key: "gallery010",
    title: "Starlit Rooftop Sky Lounge & Alfresco Deck",
    category: "image",
    cloudinaryUrl: "https://res.cloudinary.com/s8b4ps7b/image/upload/v1788786526/maytri_ambhuja/gallery/gallery_010.jpg",
    publicId: "gallery_010",
    resourceType: "image",
  },
];

export const autoSeedData = async () => {
  try {
    const mediaCount = await Media.countDocuments();
    if (mediaCount === 0) {
      console.log("🌱 Seeding initial media metadata for Cloudinary...");
      await Media.insertMany(INITIAL_MEDIA);
      console.log("✅ Cloudinary media metadata seeded successfully!");
    }

    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      console.log("🌱 Seeding initial employees...");
      await Employee.insertMany(INITIAL_EMPLOYEES);
      console.log("✅ Employees seeded successfully!");
    }

    if (process.env.AUTO_SEED_SAMPLE_DATA === "true") {
      const leadCount = await Lead.countDocuments();
      if (leadCount === 0) {
        console.log("🌱 Seeding initial leads...");
        await Lead.insertMany(INITIAL_SAMPLE_LEADS);
        console.log("✅ Leads seeded successfully!");
      }

      const callLogCount = await CallLog.countDocuments();
      if (callLogCount === 0) {
        console.log("🌱 Seeding initial call logs...");
        await CallLog.insertMany(INITIAL_CALL_LOGS);
        console.log("✅ Call logs seeded successfully!");
      }

      const emailLogCount = await EmailLog.countDocuments();
      if (emailLogCount === 0) {
        console.log("🌱 Seeding initial email logs...");
        await EmailLog.insertMany(INITIAL_EMAIL_LOGS);
        console.log("✅ Email logs seeded successfully!");
      }
    }
  } catch (error) {
    console.error("Auto-seed error:", error.message);
  }
};

// If run directly via `npm run seed`
if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  (async () => {
    const conn = await connectDB();
    if (conn) {
      await autoSeedData();
      console.log("🎉 Database seeding complete!");
      process.exit(0);
    } else {
      process.exit(1);
    }
  })();
}
