/* eslint-disable @typescript-eslint/no-unused-vars */
import { client } from "@/sanity/lib/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageUrlBuilder from "@sanity/image-url";
import { apiVersion, dataset, projectId, token } from "../sanity/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response));
}

//We now need a utility function to upload the image into the sanity image assets.
export const uploadImage = async (file: File) => {
  try {
    const imageAssets = await client.assets.upload("image", file, {
      contentType: file.type,
      filename: file.name,
    });
    return imageAssets;
  } catch (error) {
    console.log(token);
    console.error("Image upload error:", error); // Log the error for debugging
    throw error;
  }
};

const builder = imageUrlBuilder(client);
export function urlFor(source) {
  return builder.image(source);
}
