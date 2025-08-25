import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db/connection";
import { achievements } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_S3!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_S3!,
    sessionToken: process.env.AWS_SESSION_TOKEN_S3,
  },
});


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim();
    const questIdValue = formData.get("achievementQuest")?.toString();
    const questId = questIdValue ? Number(questIdValue) : NaN;
    const imageFile = formData.get("image") as File | null;

    if (!title || !description || isNaN(questId)) {
      console.log("title:", title, "description:", description, "questId:", questId, "imageFile:", imageFile);
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert achievement
    const [newAchievement] = await db
      .insert(achievements)
      .values({
        achievement_title: title,
        achievement_description: description,
        quest_id: questId,
        achievement_icon: "", 
      })
      .returning();

    if (!newAchievement?.id) {
      return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
    }

    let imageUrl = "";
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const s3Key = `achievement/${newAchievement.id}/${imageFile.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: s3Key,
          Body: buffer,
          ContentType: imageFile.type,
          ACL: "public-read",
        })
      );

      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${s3Key}`;

      // Update achievement with image URL
      const [updatedAchievement] = await db
        .update(achievements)
        .set({ achievement_icon: imageUrl })
        .where(eq(achievements.id, newAchievement.id))
        .returning();

      return NextResponse.json({ achievement: updatedAchievement });
    }

    // No image, just return inserted achievement
    return NextResponse.json({ achievement: newAchievement });
  } catch (err) {
    console.error("Failed to create achievement:", err);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
