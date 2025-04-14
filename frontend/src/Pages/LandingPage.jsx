import React from 'react'
import HeroSection from '../Components/Home/HeroSection'
import PrepSimplifier from '../Components/Home/PrepSimplifier'



function LandingPage() {
    return (
        <div className='  w-full overflow-x-hidden'>
            <HeroSection />
            <PrepSimplifier />
            {/* <CodingPlatform />
            
            <CodingPortfolio />
            <FAQ />      */}
        </div>
    )
}

export default LandingPage
