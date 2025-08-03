import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  title: string;
  url: string;
  altText: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ImageSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    altText: { type: String },
    uploadedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);