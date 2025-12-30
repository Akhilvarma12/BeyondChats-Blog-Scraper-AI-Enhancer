import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true
    },

    content: {
      type: String,
      required: true
    },

    source: {
      type: String,
      enum: ["beyondchats", "generated"],
      default: "beyondchats"
    },

    isUpdatedVersion: {
      type: Boolean,
      default: false
    },

    references: {
      type: [String],
      default: []
    },

    originalArticleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Article = mongoose.model("Article", articleSchema);
