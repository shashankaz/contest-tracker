import mongoose from "mongoose";

export interface ISolution extends mongoose.Document {
  title: string;
  videoUrl?: string;
  links?: string[];
}

const solutionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    links: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

solutionSchema.index({ title: "text" });

const Solution =
  mongoose.models.Solution ||
  mongoose.model<ISolution>("Solution", solutionSchema);

export default Solution;
