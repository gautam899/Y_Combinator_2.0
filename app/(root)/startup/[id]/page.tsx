/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
// /startup/2

import React, { Suspense } from 'react'
import { PLAYLIST_BY_SLUG_QUERY, STARTUP_BY_ID_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import { formatDate, urlFor } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
export const experimental_ppr = true;
import markdownit from "markdown-it";
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupTypeCard } from '@/components/StartupCard';
const md = markdownit();
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;
    //Since both the queries are independent of each other we an perform parallel fetching to improve the time complexity.
    //So instead of the time to fetch being the sum of both the queries the time would be the longest of the two.
    const [post, { select: editorPosts }] = await Promise.all([
        client.fetch(STARTUP_BY_ID_QUERY, { id }),
        client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks' })
    ])
    if (!post) {
        return notFound();
    }
    const parsedContent = md.render(post?.pitch || '')
    const PostImage = post.imageURL ? urlFor(post.imageURL.asset._ref).url() : undefined;
    return (
        <>
            <section className='pink_container !min-h-[230px]'>
                <p className='tag'>{formatDate(post?._createdAt)}</p>
                <h1 className='heading'>{post.title}</h1>
                <p className='sub-heading !max-w-5xl'>{post.description}</p>
            </section>
            <section className='section_container'>
                <img src={PostImage} alt="thumbnail" className='w-full h-auto rounded-xl' />
                <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
                    <div className='flex-between gap-5'>
                        <Link href={`/user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                            <Image src={post.author.image} alt="user_image"
                                height={64}
                                width={64}
                                className='rounded-full drop-shadow-lg' />
                            <div>
                                <p className='text-20-medium'>{post.author.name}</p>
                                <p className='text-16-medium !text-black-300'>@{post.author.username}</p>
                            </div>
                        </Link>
                        <p className='post-category'>{post.category}</p>
                    </div>
                    <h3 className='text-30-bold'>Pitch Details</h3>
                    {
                        parsedContent ? (
                            <article className='prose max-w-4xl font-work-sans break-all'
                                dangerouslySetInnerHTML={{ __html: parsedContent }}
                            />
                        ) : (
                            <p className='no-result'>No Details Provided</p>
                        )
                    }

                </div>
                <hr className='divider' />
                {editorPosts?.length > 0 && (
                    <div className='max-w-4xl mx-auto'>
                        <p className='text-30-semibold'>Editor Picks</p>
                        <ul className='mt-7 card_grid-sm'>
                            {
                                editorPosts.map((post: StartupTypeCard, i: number) => (
                                    <StartupCard key={i} post={post} />
                                ))
                            }
                        </ul>
                    </div>
                )}
            </section>
            <section>
                <Suspense fallback={<Skeleton className='view-skeleton' />} >
                    <View id={id} />
                </Suspense>
            </section>
        </>
    )
}

export default page