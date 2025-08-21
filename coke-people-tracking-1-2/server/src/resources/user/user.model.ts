import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import User from "@/resources/user/user.interface";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ADMIN"],
    },
  },
  { timestamps: true }
);

UserSchema.pre<User>("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  next();
});

export default model<User>("User", UserSchema);
