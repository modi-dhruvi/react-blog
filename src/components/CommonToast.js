import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CommonToast() {
    toast.success("Post approved successfully", { autoClose: 3000 })
    return (
        <div>
            <ToastContainer />

        </div>
    )
}
