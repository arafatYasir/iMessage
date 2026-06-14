import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        clerkId: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        profilePic: {
            type: String,
            default: ""
        },
    },
    {
        timestamps: true
    }
);

const User = mongoose.models("User", userSchema);

export default User;