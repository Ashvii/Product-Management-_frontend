import { useEffect } from "react"

import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminProduct from './AdminProduct'

function AdminHome() {

    const [token, settoken] = useState("")

    useEffect(() => {

        if (localStorage.getItem("token")) {

            const token = localStorage.getItem("token")
            settoken(token)

        }

    }, [])

    return (

        <>
            {!token ? (

                <div className="flex justify-center items-center h-screen">
                    <img
                        src="error.png"
                        alt="page not found"
                        className="w-[90%] max-w-[400px]"
                    />
                </div>



            ) : (
                <div className="flex min-h-screen bg-gray-900">
                    <AdminSidebar />

                    <div className="flex-1 p-6">

                        <AdminProduct />

                    </div>
                </div>

            )
            }

        </>
    )
}

export default AdminHome
