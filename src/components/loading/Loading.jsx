'use client'

import React from 'react'
import '@/styles/loading.css'
import { Dialog } from '@mui/material'
import { useSelector } from 'react-redux';

function Loading({ loadingLocal }) {
    const isLoading = useSelector((state) => state.loading.isLoading)

    return (
        /* From Uiverse.io by Fareny */
        <Dialog open={loadingLocal === undefined ? isLoading : loadingLocal}>
            <div class="loader">
                <figure class="iconLoaderProgress">
                    <svg class="iconLoaderProgressFirst" width="240" height="240">
                        <circle cx="120" cy="120" r="100"></circle>
                    </svg>

                    <svg class="iconLoaderProgressSecond" width="240" height="240">
                        <circle cx="120" cy="120" r="100"></circle>
                    </svg>
                </figure>
            </div>
        </Dialog>
    )
}

export default Loading