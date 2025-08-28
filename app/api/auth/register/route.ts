import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db/connection";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcrypt";

const RegistrationSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(256),
  password: z.string().min(6),
  gender: z.string().optional(),
});

// Array of random profile picture URLs from S3 TODO: add the links from s3
const profilePictureUrls = [
  "https://avatars.githubusercontent.com/u/107231772?v=4",
  "https://avatars.githubusercontent.com/u/107231772?v=4",
  "https://avatars.githubusercontent.com/u/107231772?v=4",
  "https://avatars.githubusercontent.com/u/107231772?v=4",
  "https://avatars.githubusercontent.com/u/107231772?v=4",
  "https://avatars.githubusercontent.com/u/107231772?v=4",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, username, password, gender } =
      RegistrationSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 },
      );
    }

    // Check if username is already taken
    const existingUsername = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername.length > 0) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 },
      );
    }

    // Hash the password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Select a random profile picture
    const randomProfilePicture =
      profilePictureUrls[Math.floor(Math.random() * profilePictureUrls.length)];

    // Insert the new user
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        username: username,
        passwordHash: passwordHash,
        gender: gender,
        profile_picture_url: randomProfilePicture,
        role: "user",
        online_status: false,
        suspension_status: false,
      })
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        profile_picture_url: users.profile_picture_url,
        role: users.role,
        created_at: users.created_at,
      });

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: newUser,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
