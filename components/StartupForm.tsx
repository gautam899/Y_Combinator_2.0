/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import MDEditor from "@uiw/react-md-editor"
import { Send } from 'lucide-react'
import { Button } from './ui/button'
import { formSchema } from '@/lib/validation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { createPitch } from '@/lib/actions'
import { uploadImage } from '@/lib/utils'


const StartupForm = () => {
    const [error, setError] = useState<Record<string, string>>({})
    const [pitch, setPitch] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { toast } = useToast();
    const router = useRouter();
    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        //get the form data
        try {
            if (imageFile) {
                const imageAsset = await uploadImage(imageFile);
                formData.set("imageURL", imageAsset.url);
            }
            else {
                formData.set("imageURL", "");
            }
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                // link: formData.get("link") as string,
                imageURL: formData.get("imageURL") as string,
                pitch,
            }
            console.log(formValues);
            //validate the formData
            await formSchema.parseAsync(formValues);
            console.log(formValues);

            const result = await createPitch(prevState, formData, pitch);
            console.log(result);
            if (result.status == "SUCCESS") {
                toast({
                    title: "success",
                    description: "Idea created successfully",
                });

                router.push(`/startup/${result._id}`)
            }
            return result;

        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldsErrors = error.flatten().fieldErrors;
                setError(fieldsErrors as unknown as Record<string, string>);
                toast({
                    title: "Error",
                    description: "Please check all the inputs and try again",
                    variant: "destructive",
                })
                return { ...prevState, error: "Validation failed", status: "ERROR" }
            }
            toast({
                title: "Error",
                description: "An unexpected error has occurred",
                variant: "destructive",
            })
            return {
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };

        }
    }

    const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            // let imageUrl = "";
            // if (imageFile) {
            //     const imageAsset = await uploadImage(imageFile);
            //     imageUrl = imageAsset.url;
            //     console.log(imageAsset);
            //     toast({
            //         title: "Success",
            //         description: "URL is fetched successfully",
            //         variant: "destructive",
            //     })
            // }
        }
    }

    const [state, formAction, isPending] = useActionState(handleFormSubmit,
        {
            error: "",
            status: "INITIAL",
        }
    );

    return (
        <form action={formAction} className='startup-form'>

            {/* Title */}
            <div>
                <label htmlFor="title" className='startup-form_label'>
                    Title
                </label>
                <Input id='title' name='title' className='startup-form_input' required placeholder='Startup Title' />
                {error.title && <p className='startup-form_error'>{error.title}</p>}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className='startup-form_label'>
                    Description
                </label>
                <Textarea id='description' name='description' className='startup-form_textarea' required placeholder='Startup Description' />
                {error.description && <p className='startup-form_error'>{error.description}</p>}
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className='startup-form_label'>
                    Category
                </label>
                <Input id='category' name='category' className='startup-form_input' required placeholder='Startup Category(Tech,Health,Education etc.)' />
                {error.category && <p className='startup-form_error'>{error.category}</p>}
            </div>

            {/* Image Link */}
            {/* <div>
                <label htmlFor="link" className='startup-form_label'>
                    Image
                </label>
                <Input id='link' name='link' className='startup-form_input' required placeholder='Startup Image URL' />
                {error.link && <p className='startup-form_error'>{error.link}</p>}
            </div> */}
            {/* Image Upload */}
            <div>
                <label htmlFor="link" className='startup-form_label'>
                    Image
                </label>
                <Input id="image" name="image" type="file"
                    className="text-sm text-stone-500
                            file:mr-5 file:py-1 file:px-3 file:border-[1px]
                            file:text-xs file:font-medium
                            file:bg-stone-50 file:text-stone-700
                            hover:file:cursor-pointer hover:file:bg-blue-50
                            hover:file:text-blue-700"
                    required
                    onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Image Preview" className="w-full h-auto mt-2 rounded-xl" />}
            </div>
            {/* Pitch */}
            <div data-color-mode="light">
                <label htmlFor="pitch" className='startup-form_label'>
                    Pitch
                </label>
                <MDEditor
                    value={pitch}
                    onChange={(value) => setPitch(value as string)}
                    id='pitch'
                    preview='edit'
                    height={300}
                    style={{ borderRadius: 20, overflow: "hidden" }}
                    textareaProps={{
                        placeholder: "Briefly describe your idea and what problem does it solves.",
                    }}
                    previewOptions={{
                        disallowedElements: ["styles"]
                    }}
                />
                {error.pitch && <p className='startup-form_error'>{error.pitch}</p>}
            </div>

            {/* Submit Details */}
            <Button type='submit' className='startup-form_btn text-white'
                disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit your pitch'}
                <Send className='size-6 ml-2' />
            </Button>

        </form>
    )
}

export default StartupForm