/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";

// In this peice of code we will define a validation schema for the form data that we are entering in the
// form.
const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters long" })
    .max(500),
  category: z
    .string()
    .min(3, { message: "Category must be at least 3 characters long" })
    .max(20),
  imageURL: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  pitch: z
    .string()
    .min(10, { message: "Pitch must be at least 10 characters long" }),
});
