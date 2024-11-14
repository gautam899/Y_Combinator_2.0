/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import Form from "next/form";
import SearchFormReset from './SearchFormReset';
import { Search } from 'lucide-react';

const SearchForm = ({ query }: { query?: string }) => {

    return (
        <Form action="/" scroll={false} className='search-form'>
            <input name='query' className='search-input' defaultValue='' placeholder="Search Startups" />
            <div className='flex gap-2'>
                {query && (
                    // To ensure that this component is rendered on the server side we will make a seperate component form the input field
                    // since it will include interativity from the client
                    <SearchFormReset />
                )}
                <button type='submit' className='search-btn text-white'>
                    <Search className='size-5'/>
                </button>
            </div>
        </Form>
    )
}

export default SearchForm