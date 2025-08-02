import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const FileSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    uploadedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.models.File || mongoose.model<IFile>("File", FileSchema);