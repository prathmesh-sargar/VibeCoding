import React from 'react'
import Header from '../Components/Home/Header'
import Footer from '../Components/Home/Footer'
import { Outlet } from 'react-router-dom'
import ScrollToTop from '../Components/ScrollToTop'
function Layout() {
    return (
        <div>
            <ScrollToTop />
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout
