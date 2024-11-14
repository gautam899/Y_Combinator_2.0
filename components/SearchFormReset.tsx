"use client";
import { X } from 'lucide-react';
// This component will be client side since we have button and onClick
// and it includes interation from the user's side.
import Link from 'next/link';
import React from 'react'

const SearchFormReset = () => {
    const reset = () => {
        const form = document.querySelector('.search-form') as HTMLFormElement
        //If the form exist we reset it.
        if (form) {
            form.reset();
        }
    }
    return (
        <button type='reset' onClick={reset}>
            <Link href="/" className='search-btn text-white'>
                <X className='size-5' />
            </Link>
        </button>
    )
}

export default SearchFormReset