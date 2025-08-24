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
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const score = Number(formData.get("score"));
    const imageFile = formData.get("image") as File;

    if (!title || !description || !score) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // insert achievement first
    const [newAchievement] = await db
      .insert(achievements)
      .values({
        achievement_title: title,
        achievement_description: description,
        achievement_score: score,
        achievement_icon: "", 
      })
      .returning();

    if (!newAchievement?.id) {
      return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
    }

    // get achievement id and insert image into s3buckets with relevant format
    let imageUrl = "";
    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const s3Key = `achievement/${newAchievement.id}/${imageFile.name}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: s3Key,
          Body: buffer,
          ContentType: imageFile.type,
          ACL: "public-read" 
        })
      );
      imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

      // update the achievement with S3 URL
      const [updatedAchievement] = await db
        .update(achievements)
        .set({ achievement_icon: imageUrl })
        .where(eq(achievements.id, newAchievement.id))
        .returning();

      return NextResponse.json({ achievement: updatedAchievement });
    }

    return NextResponse.json({ achievement: newAchievement });
  } catch (err) {
    console.error("Failed to create achievement:", err);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
