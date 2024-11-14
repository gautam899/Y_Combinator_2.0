/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

//We will define a server action here in this section of code.
import { auth } from "@/auth";
import { parseServerActionResponse } from "./utils";

import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
export const createPitch = async (
  state: any,
  form: FormData,
  pitch: string
) => {
  //if we have a session
  const session = await auth();
  if (!session) {
    return parseServerActionResponse({
      error: "Not Signed In",
      status: "ERROR",
    });
  }
  const { title, description, category, imageURL } = Object.fromEntries(
    Array.from(form).filter(([key]) => key !== "pitch")
  );
  const slug = slugify(title as string, { lower: true, strict: true });
  try {
    const startup = {
      title,
      description,
      category,
      imageURL,
      slug: {
        _type: slug,
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session?.id,
      },
      pitch,
    };
    // Write to sanity client to create a new startup.
    const result = await writeClient.create({ _type: "startup", ...startup });
    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.log(error);
    return parseServerActionResponse({
      error: JSON.stringify(error),
      status: "ERROR",
    });
  }
};
