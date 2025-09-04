import React, { useContext } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import JoblListing from '../components/JoblListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'
import Recruiter from '../components/Recruiter'
import { AppContext } from '../context/AppContext'

const Home = () => {

  const {showRecruiterLogin} = useContext(AppContext)
  return (
    <div>
      {showRecruiterLogin && <Recruiter />}
      <Navbar/>
      <Hero/>
      <JoblListing/>
      <AppDownload/>
      <Footer/>
    </div>
  )
}

export default Home
