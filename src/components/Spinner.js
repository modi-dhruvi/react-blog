import React from 'react'
import ScaleLoader from 'react-spinners/ScaleLoader'

export default function Spinner() {
    return (
        <div className='loading-overlay'>
            <div className='spinner m-5'>
                <div><ScaleLoader color='#000' /></div>
            </div>
        </div>
    )
}
