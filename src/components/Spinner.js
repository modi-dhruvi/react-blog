import React from 'react'
import DotLoader from 'react-spinners/DotLoader'
import ScaleLoader from 'react-spinners/ScaleLoader'
import PuffLoader from 'react-spinners/PuffLoader'
import gif from '../DrStarnge.gif'

export default function Spinner() {
    return (
        <div className='loading-overlay'>
            <div className='spinner m-5'>
                <div><ScaleLoader color='#000' /></div>
                {/* <div><ScaleLoader color='#000' /></div> */}
                {/* <div><PuffLoader color='#000'/></div> */}
                {/* <img src={gif} /> */}
            </div>
        </div>
    )
}
