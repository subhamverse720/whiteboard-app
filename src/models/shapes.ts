import mongoose, { Schema, Document } from "mongoose";

export interface IShape extends Document {
  type: string; // e.g., "circle", "rectangle", "line"
  properties: Record<string, any>; // Dynamic properties like radius, width, height, etc.
  createdBy: mongoose.Types.ObjectId; // Reference to the user who created the shape
  createdAt: Date;
}

const ShapeSchema: Schema = new Schema(
  {
    type: { type: String, required: true }, // Shape type
    properties: { type: Schema.Types.Mixed, required: true }, // Dynamic properties
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

export default mongoose.models.Shape || mongoose.model<IShape>("Shape", ShapeSchema);