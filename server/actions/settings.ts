"use server";

import { SettingsSchema } from "@/types/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import db from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const settings = action
  .schema(SettingsSchema)
  .action(async ({ parsedInput: data }) => {
    const user = await auth();
    if (!user) {
      return {
        error: {
          message: "You should login first",
        },
      };
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.user.id),
    });

    if (!dbUser) {
      return {
        error: {
          message: "User not found",
        },
      };
    }

    if (user.user.isOuth) {
      data.email = undefined;
      data.password = undefined;
      data.newPassword = undefined;
      data.isTwoFactorEnabled = undefined;
    }

    if (data.password && data.newPassword && dbUser.password) {
      const match = await bcrypt.compare(data.password, dbUser.password);
      if (match) {
        const samePssword = await bcrypt.compare(
          data.newPassword,
          dbUser.password
        );

        if (samePssword) {
          return {
            error: {
              message: "The new password is the same as old one ✋🏻",
            },
          };
        }
      } else {
        return {
          error: {
            message: "The password is incorrect",
          },
        };
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      data.password = hashedPassword
      data.newPassword = undefined;
    }
    await db
      .update(users)
      .set({
        name: data.name,
        password: data.password,
        twoFactorEnabled: data.isTwoFactorEnabled,
        image: data.image,
      })
      .where(eq(users.id, dbUser.id));

    revalidatePath("/dashboard/settings");
    return {
      success: {
        message: "Settings Updated",
      },
    };
  });
