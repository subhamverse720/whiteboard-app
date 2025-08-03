import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema);