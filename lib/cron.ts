import cron from "node-cron";
import { db } from "../lib/db/connection";
import { quests, users } from "../lib/db/schema";
import { eq, and, lte, inArray } from "drizzle-orm";
import { sendEmail } from "../lib/email"; 
import { DateTime } from "luxon";

// Run every minute
cron.schedule("* * * * *", async () => {
  console.log("Cron job running:", new Date().toISOString());

  // Get current Malaysia time
  const malaysiaNow = DateTime.now().setZone("Asia/Kuala_Lumpur");

  // Find quests that should trigger notification
  const availableQuests = await db
    .select()
    .from(quests)
    .where(
      and(
        lte(quests.available_date, malaysiaNow.toJSDate()), 
        eq(quests.notification_sent, false)
      )
    );

  if (availableQuests.length === 0) return;

  const recipients = await db
    .select()
    .from(users)
    .where(inArray(users.role, ["user", "practitioner"]));

  for (const q of availableQuests) {
    for (const r of recipients) {
      await sendEmail({
        to: r.email,
        subject: `Quest Available: ${q.title}`,
        text: `        
        🎯 New Quest Available!

        Quest ID: ${q.id}
        ───────────────────────────────
        📌 Title: ${q.title}
        📝 Description: ${q.description}
        ⭐ Difficulty: ${q.difficulty_level}
        🏆 Points: ${q.points_awarded}
        📅 Available: ${
          q.available_date
            ? DateTime.fromJSDate(q.available_date).setZone("Asia/Kuala_Lumpur").toFormat("dd/MM/yyyy HH:mm")
            : "N/A"
        }
        ⏳ Expires: ${
          q.expiration_date
            ? DateTime.fromJSDate(q.expiration_date).setZone("Asia/Kuala_Lumpur").toFormat("dd/MM/yyyy HH:mm")
            : "N/A"
        }
        ───────────────────────────────`
      });
    }

    await db
      .update(quests)
      .set({ notification_sent: true })
      .where(eq(quests.id, q.id));
  }
});
