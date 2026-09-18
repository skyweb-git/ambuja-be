import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'website_config_v1',
    },
    hero: {
      eyebrowBadge: { type: String, default: 'MAYTRI GROUP' },
      reraNumber: { type: String, default: 'P02400007647' },
      title: { type: String, default: 'Exclusive Villa Township in Hyderabad' },
      subheading: { type: String, default: 'Spacious Villas with Picturesque Pathways & Rich Finishes' },
      description: {
        type: String,
        default: 'Surrounded by pristine landscapes and tree-lined avenues, experience an eco-friendly lifestyle designed for comfortable community living.',
      },
      startingPrice: { type: String, default: '₹3.8 Cr*' },
      tokenAdvance: { type: String, default: '₹5 Lakhs' },
      highlights: [
        { title: { type: String, default: '4.5 Acres' }, subtitle: { type: String, default: 'Dedicated Green Park' } },
        { title: { type: String, default: 'Spacious Villas' }, subtitle: { type: String, default: 'Picturesque Pathways' } },
        { title: { type: String, default: 'Rich Finishes' }, subtitle: { type: String, default: 'Premium Living' } },
        { title: { type: String, default: 'All Age Groups' }, subtitle: { type: String, default: 'Inclusive Villa Spaces' } },
      ],
    },
    about: {
      sectionTitle: { type: String, default: 'Where Nature Meets Architectural Opulence' },
      tagline: { type: String, default: 'A Masterpiece of Luxury Living in Shamshabad' },
      description1: {
        type: String,
        default: 'Nestled amidst 35+ acres of verdant serenity, Maytri Ambhuja is Hyderabad’s pinnacle luxury villa community crafted for discerning global citizens.',
      },
      description2: {
        type: String,
        default: 'Strategically located minutes from Shamshabad & ORR Exit 12, each villa is an epitome of timeless contemporary architecture with 100% Vaastu compliance.',
      },
      totalVillas: { type: String, default: '150+ Luxury Villas' },
      totalAcres: { type: String, default: '35+ Acres Township' },
      clubhouseSize: { type: String, default: '90,000 Sq.Ft Clubhouse' },
    },
    clubhouse: {
      title: { type: String, default: 'The Grand Ambhuja Clubhouse' },
      tagline: { type: String, default: '90,000 Sq.Ft of Resort-Class Leisure & Wellness' },
      description: {
        type: String,
        default: 'An architectural marvel offering 30+ bespoke luxury amenities including infinity pools, private 4K preview theatres, Olympic multi-sport arenas, and Ayurvedic spas.',
      },
    },
    contact: {
      phone: { type: String, default: '+91 98490 12345' },
      whatsapp: { type: String, default: '+91 98490 12345' },
      email: { type: String, default: 'info@sanghicity.in' },
      siteAddress: { type: String, default: 'Maytri Ambhuja, Near ORR Exit 12, Shamshabad - Sanghi Nagar Road, Hyderabad, Telangana 501511' },
      officeHours: { type: String, default: 'Monday – Sunday: 9:30 AM – 7:30 PM' },
    },
    brochure: {
      url: { type: String, default: '/assets/maytri-ambhuja-brochure.pdf' },
      modalTitle: { type: String, default: 'Download Maytri Ambhuja Brochure' },
      modalDesc: { type: String, default: 'Receive the official villa township brochure featuring master plan details, 90,000 sq.ft clubhouse features, and 222 & 300 SQ YD floor plans.' },
    },
    amenitiesSection: {
      eyebrowTag: { type: String, default: 'RESORT-STYLE CONVENIENCES' },
      title: { type: String, default: 'Amenities' },
      subtitle: { type: String, default: 'A comprehensive suite of modern lifestyle, wellness, sports, and daily conveniences curated for all age groups.' },
      items: { type: Array, default: [] }
    },
    projectsSection: {
      eyebrowTag: { type: String, default: 'LANDMARK DEVELOPMENTS' },
      title: { type: String, default: 'Our Projects' },
      subtitle: {
        type: String,
        default: 'Explore premier master-planned townships and signature villa communities developed with unmatched luxury, architectural brilliance, and strategic connectivity.'
      },
      items: { type: Array, default: [] }
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

export const Content = mongoose.model('Content', contentSchema);
