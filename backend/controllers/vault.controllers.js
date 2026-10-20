import mongoose from "mongoose";
import { Password } from "../models/Password.js";
import { SSHKey } from "../models/SSHKey.js";
import { APIKey } from "../models/APIKey.js";
import { CreditCard } from "../models/CreditCard.js";
import { SecureNote } from "../models/SecureNote.js";

const getModel = (type) => {
  const models = {
    passwords: Password,
    "ssh-keys": SSHKey,
    "api-keys": APIKey,
    "credit-cards": CreditCard,
    "secure-notes": SecureNote,
  };
  return models[type];
};

const getTypeLabel = (type) => {
  const labels = {
    passwords: "Password",
    "ssh-keys": "SSH Key",
    "api-keys": "API Key",
    "credit-cards": "Credit Card",
    "secure-notes": "Secure Note",
  };
  return labels[type] || "Item";
};

export const getAllItems = async (req, res) => {
  const type = req.params.type;
  const Model = getModel(type);
  const userId = req.userId;

  if (!Model) {
    return res.status(400).json({ success: false, message: "Invalid vault type!" });
  }

  try {
    const { search, tags, category, sort = "-updatedAt", page = 1, limit = 50 } = req.query;

    const query = { userId };
    if (search) {
      query.$text = { $search: search };
    }
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }
    if (category && type === "passwords") {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await Model.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Model.countDocuments(query);

    res.status(200).json({
      success: true,
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getItem = async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const Model = getModel(type);
  const userId = req.userId;

  if (!Model) {
    return res.status(400).json({ success: false, message: "Invalid vault type!" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid item ID!" });
  }

  try {
    const item = await Model.findById(id).lean();

    if (!item) {
      return res.status(404).json({ success: false, message: `${getTypeLabel(type)} not found!` });
    }

    if (!item.userId.equals(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to access this item!" });
    }

    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const createItem = async (req, res) => {
  const type = req.params.type;
  const Model = getModel(type);
  const userId = req.userId;

  if (!Model) {
    return res.status(400).json({ success: false, message: "Invalid vault type!" });
  }

  try {
    const item = new Model({
      userId,
      ...req.body,
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: `${getTypeLabel(type)} saved successfully!`,
      item,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateItem = async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const Model = getModel(type);
  const userId = req.userId;

  if (!Model) {
    return res.status(400).json({ success: false, message: "Invalid vault type!" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid item ID!" });
  }

  try {
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: `${getTypeLabel(type)} not found!` });
    }

    if (!item.userId.equals(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to update this item!" });
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();

    res.status(200).json({
      success: true,
      message: `${getTypeLabel(type)} updated successfully!`,
      item: updatedItem,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  const type = req.params.type;
  const id = req.params.id;
  const Model = getModel(type);
  const userId = req.userId;

  if (!Model) {
    return res.status(400).json({ success: false, message: "Invalid vault type!" });
  }

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid item ID!" });
  }

  try {
    const item = await Model.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: `${getTypeLabel(type)} not found!` });
    }

    if (!item.userId.equals(userId)) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this item!" });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: `${getTypeLabel(type)} deleted successfully!` });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getVaultStats = async (req, res) => {
  const userId = req.userId;

  try {
    const [passwords, sshKeys, apiKeys, creditCards, secureNotes] = await Promise.all([
      Password.countDocuments({ userId }),
      SSHKey.countDocuments({ userId }),
      APIKey.countDocuments({ userId }),
      CreditCard.countDocuments({ userId }),
      SecureNote.countDocuments({ userId }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        passwords,
        sshKeys,
        apiKeys,
        creditCards,
        secureNotes,
        total: passwords + sshKeys + apiKeys + creditCards + secureNotes,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const bulkDelete = async (req, res) => {
  const { ids, type } = req.body;
  const Model = getModel(type);
  const userId = req.userId;

  if (!Model || !ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid request!" });
  }

  const validIds = ids.filter((id) => mongoose.isValidObjectId(id));

  try {
    const result = await Model.deleteMany({
      _id: { $in: validIds },
      userId,
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} items deleted successfully!`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const exportVault = async (req, res) => {
  const userId = req.userId;

  try {
    const [passwords, sshKeys, apiKeys, creditCards, secureNotes] = await Promise.all([
      Password.find({ userId }).lean(),
      SSHKey.find({ userId }).lean(),
      APIKey.find({ userId }).lean(),
      CreditCard.find({ userId }).lean(),
      SecureNote.find({ userId }).lean(),
    ]);

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      passwords,
      sshKeys,
      apiKeys,
      creditCards,
      secureNotes,
    };

    res.status(200).json({
      success: true,
      data: exportData,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};