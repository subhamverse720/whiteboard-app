import mongoose ,{ model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser {
   email : string,
   password : string,
   _id?: mongoose.Types.ObjectId,
    updatedAt?: Date,
    createdAt?: Date,
}

const UserSchema = new Schema<IUser>(
    {
        email: {type :String , required: true, unique:true},
        password: {type: String, required: true, }
    },
    {
        timestamps: true
    }
)

UserSchema.pre('save', async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10) as string;
    }
    next();
})

const User = models?.User || model<IUser>("User", UserSchema)

export default User