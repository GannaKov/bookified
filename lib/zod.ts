import { z } from "zod";
import { MAX_FILE_SIZE, ACCEPTED_PDF_TYPES, MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/lib/constants";

export const UploadSchema = z.object({
    pdf: z
        .instanceof(File, { message: "Please upload a PDF file." })
        .refine((f) => ACCEPTED_PDF_TYPES.includes(f.type), "Only PDF files are accepted")
        .refine((f) => f.size <= MAX_FILE_SIZE, "PDF must be under 50 MB."),
    coverImage: z.instanceof(File).optional()
        .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, "Image size must be less than 10MB")
        .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), "Only .jpg, .jpeg, .png and .webp formats are supported"),
    title: z.string().min(1, "Title is required.").max(100, "Title is too long"),
    author: z.string().min(1, "Author name is required.").max(100, "Author name is too long"),
    voice: z.string().min(1, "Please select a voice."),
});
