import Link from "../models/Link.js";

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find().sort({ pinned: -1, createdAt: -1 });
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addLink = async (req, res) => {
  try {
    const { title, url, category } = req.body;
    if (!title || !url || !category)
      return res.status(400).json({ message: "All fields are required" });
    const newLink = new Link({ title, url, category });
    const saved = await newLink.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const deleted = await Link.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Link not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const togglePin = async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    if (!link) return res.status(404).json({ message: "Link not found" });
    link.pinned = !link.pinned;
    await link.save();
    res.status(200).json(link);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};