import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "../../../../../lib/db";
import User from "@/models/user";

export async function POST(request : NextRequest) {

    try {
        const { email, password} = await request.json()

        if(!email || !password) {
            return NextResponse.json(
                {error : "Email and password are required"},
                {status : 400}
            )
        }
        await connectToDB()
         const existingUser = await User.findOne({email})

        if (existingUser) {
            return NextResponse.json(
                {message: "User already registered!"},
                {status: 400}
            )
        }
            await User.create(
                {email,password}
            )
        
            return NextResponse.json(
                {message: "User Registered successfully."},
                {status : 400}
            )
    } catch (error) {
        console.log("Registration error :", error)
        return NextResponse.json(
            {message : "Failure in Registration."},
            {status :400}
        )
    }
 
}
