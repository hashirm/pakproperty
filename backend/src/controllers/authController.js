import { User } from '../models/User.js';
import { Agent } from '../models/Agent.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, whatsapp, role, agencyName, city, experienceYears } = req.body;

    if (!name || !email || !password || !phone) {
      res.status(400).json({ success: false, message: 'Please provide name, email, password, and phone number.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const validRoles = ['buyer', 'seller', 'agent', 'admin'];
    const assignedRole = validRoles.includes(role) ? role : 'buyer';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      whatsapp: whatsapp || phone,
      role: assignedRole,
      isVerified: assignedRole === 'buyer',
    });

    // If registering as an agent, create Agent profile
    if (assignedRole === 'agent') {
      const agentProfile = await Agent.create({
        user: user._id,
        agencyName: agencyName || `${name} Real Estate Services`,
        city: city || 'Islamabad',
        experienceYears: Number(experienceYears) || 1,
        phone,
        whatsapp: whatsapp || phone,
        email: email.toLowerCase(),
        bio: `Professional real estate consultant serving clients in ${city || 'Islamabad'} with verified property solutions.`,
        isVerified: true,
      });

      user.agency = agentProfile._id;
      await user.save();
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide both email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const token = generateToken(user);

    let agent = null;
    if (user.role === 'agent') {
      agent = await Agent.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        agent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    let agent = null;
    if (req.user.role === 'agent') {
      agent = await Agent.findOne({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        whatsapp: req.user.whatsapp,
        role: req.user.role,
        avatar: req.user.avatar,
        isVerified: req.user.isVerified,
        createdAt: req.user.createdAt,
        agent,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { name, phone, whatsapp, avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (whatsapp) user.whatsapp = whatsapp;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsapp: user.whatsapp,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide current and new password.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
