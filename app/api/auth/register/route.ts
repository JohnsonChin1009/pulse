import { NextRequest, NextResponse } from "next/server";
import { users, pets, leaderboards } from "@/lib/db/schema";
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

const profilePictureUrls = [
  "https://pulse-app-files.s3.us-east-1.amazonaws.com/profile-pictures/bob.png",
  "https://pulse-app-files.s3.us-east-1.amazonaws.com/profile-pictures/frederick.png",
  "https://pulse-app-files.s3.us-east-1.amazonaws.com/profile-pictures/han.png",
  "https://pulse-app-files.s3.us-east-1.amazonaws.com/profile-pictures/jessica.png",
  "https://pulse-app-files.s3.us-east-1.amazonaws.com/profile-pictures/june.png",
  "https://pulse-app-files.s3.us-east-1.amazonaws.com/profile-pictures/sebastian.png",
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

    // Use a transaction to ensure data consistency
    const userResult = await db.transaction(async (tx) => {
      try {
        // Insert the new user
        const [newUser] = await tx
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

        // Create a pet for the new user
        const petNames = [
          "Pulse Buddy",
          "Heart Helper",
          "Cardio Companion",
          "Wellness Warrior",
          "Health Hero",
          "Fit Friend",
          "Active Angel",
          "Vitality Pal",
        ];
        const randomPetName =
          petNames[Math.floor(Math.random() * petNames.length)];

        const [newPet] = await tx
          .insert(pets)
          .values({
            pet_name: randomPetName,
            pet_level: 1,
            pet_happiness: 50,
            pet_status: "happy",
            user_id: newUser.id,
          })
          .returning({
            id: pets.id,
            pet_name: pets.pet_name,
            pet_level: pets.pet_level,
            pet_happiness: pets.pet_happiness,
            pet_status: pets.pet_status,
          });

        // Create initial leaderboard entry
        await tx.insert(leaderboards).values({
          highest_level: 1,
          highest_score_cumulative: 0,
          hightest_most_achievement: 0,
          user_id: newUser.id,
        });

        return { newUser, newPet };
      } catch (error) {
        console.error("Transaction failed during registration:", error);
        throw error;
      }
    });

    return NextResponse.json(
      {
        message: "User registered successfully and pet assigned!",
        user: userResult,
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
