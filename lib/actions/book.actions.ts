"use server"

import Book from "@/database/models/book.model";
import {CreateBook} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import {generateSlug, serializeData} from "@/lib/utils";

export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();

        const slug = generateSlug(data.title);

        // Todo: Check subscription limits before creating a book
       /*const { getUserPlan } = await import("@/lib/subscription.server");
     const { PLAN_LIMITS } = await import("@/lib/subscription-constants");

        const { auth } = await import("@clerk/nextjs/server");
        const { userId } = await auth();

       if (!userId || userId !== data.clerkId) {
            return { success: false, error: "Unauthorized" };
        }

        const plan = await getUserPlan();
       const limits = PLAN_LIMITS[plan];

      const bookCount = await Book.countDocuments({ clerkId: userId });

     if (bookCount >= limits.maxBooks) {
            const { revalidatePath } = await import("next/cache");
            revalidatePath("/");

           return {
                success: false,
                error: `You have reached the maximum number of books allowed for your ${plan} plan (${limits.maxBooks}). Please upgrade to add more books.`,
                isBillingError: true,
            };
        }

       const book = await Book.create({...data, clerkId: userId, slug, totalSegments: 0});*/

        const { value: book, lastErrorObject } = await Book.findOneAndUpdate(
            { slug },
            { $setOnInsert: { ...data, slug, totalSegments: 0 } },
            { upsert: true, new: true, rawResult: true, lean: true }
        );

        const alreadyExists = !lastErrorObject?.upserted;

        return {
            success: true,
            data: serializeData(book),
            ...(alreadyExists && { alreadyExists: true }),
        }
    } catch (e) {
        console.error('Error creating a book', e);

        return {
            success: false,
            error: e instanceof Error ? e.message : "Failed to create book",
        }
    }
}