/* eslint-disable @typescript-eslint/no-unused-vars */
import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUP_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";
import { urlFor } from "@/lib/utils";
//We decided to make a seperate component for searchForm because
//it will include interaction from the client i.e the input feild etc. which cannot be
//rendered on server.
export default async function Home({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const query = (await searchParams).query;
  const params = { search: query || null };
  const { data: posts } = await sanityFetch({ query: STARTUP_QUERY, params })
  console.log(posts);
  const session = await auth();
  // console.log(session?.id)
  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Pitch Your Idea <br /> Connect with Enterpreneurs</h1>
        <p className="sub-heading !max-w-3xl">
          Pitch your idea to a network of entrepreneurs, investors, and industry experts.
        </p>
        <SearchForm query={query} />

      </section>
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for ${query}` : "All Startups"}
        </p>
        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No Startups Found</p>
          )
          }
        </ul>
      </section>
      <SanityLive />
    </>
  );
}
