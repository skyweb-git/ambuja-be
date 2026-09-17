import { Content } from '../models/Content.js';

const DEFAULT_KEY = 'website_config_v1';

// GET /api/content
export const getContent = async (req, res) => {
  try {
    let content = await Content.findOne({ key: DEFAULT_KEY });
    if (!content) {
      content = await Content.create({ key: DEFAULT_KEY });
    }
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch website content', error: error.message });
  }
};

// PUT /api/content
export const updateContent = async (req, res) => {
  try {
    const updates = req.body;
    const content = await Content.findOneAndUpdate(
      { key: DEFAULT_KEY },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.json({ success: true, message: 'Website content updated successfully', data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update website content', error: error.message });
  }
};
