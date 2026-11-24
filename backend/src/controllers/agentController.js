import { Agent } from '../models/Agent.js';
import { Property } from '../models/Property.js';
import { Review } from '../models/Review.js';

export const getAgents = async (req, res) => {
  try {
    const { city, search, sort = 'rating', page = '1', limit = '12' } = req.query;

    const query = { isVerified: true };

    if (city) {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    if (search) {
      const searchRegex = new RegExp(String(search), 'i');
      query.$or = [
        { agencyName: searchRegex },
        { city: searchRegex },
        { operatingAreas: searchRegex },
        { bio: searchRegex },
      ];
    }

    let sortOption = { rating: -1, reviewCount: -1 };
    if (sort === 'experience') {
      sortOption = { experienceYears: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * pageSize;

    const [agents, total] = await Promise.all([
      Agent.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .populate('user', 'name avatar email phone whatsapp'),
      Agent.countDocuments(query),
    ]);

    const agentIds = agents.map((a) => a._id);
    const propertyCounts = await Property.aggregate([
      { $match: { agency: { $in: agentIds }, status: 'approved' } },
      { $group: { _id: '$agency', count: { $sum: 1 } } },
    ]);

    const countMap = new Map();
    propertyCounts.forEach((pc) => countMap.set(String(pc._id), pc.count));

    const enriched = agents.map((agent) => {
      const obj = agent.toObject();
      return {
        ...obj,
        activeListingsCount: countMap.get(String(agent._id)) || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: enriched,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAgentById = async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id).populate('user', 'name avatar email phone whatsapp');
    if (!agent) {
      res.status(404).json({ success: false, message: 'Agent not found.' });
      return;
    }

    const properties = await Property.find({
      $or: [{ agency: agent._id }, { user: agent.user._id }],
      status: 'approved',
    })
      .sort({ createdAt: -1 })
      .limit(20);

    const reviews = await Review.find({ agent: agent._id })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      data: {
        agent,
        properties,
        reviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createAgentReview = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'You must be logged in to write a review.' });
      return;
    }

    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      res.status(400).json({ success: false, message: 'Rating and comment are required.' });
      return;
    }

    const agent = await Agent.findById(id);
    if (!agent) {
      res.status(404).json({ success: false, message: 'Agent not found.' });
      return;
    }

    const review = await Review.create({
      agent: agent._id,
      author: req.user._id,
      rating: Number(rating),
      comment,
    });

    const allReviews = await Review.find({ agent: agent._id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    agent.rating = Number(avgRating.toFixed(1));
    agent.reviewCount = allReviews.length;
    await agent.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
