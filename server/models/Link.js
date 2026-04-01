import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);
export default Link;