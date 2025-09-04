import React from 'react'
import { assets } from '../assets/assets'
 const Footer = () => {
   return (
     <div className='container 2xl:px flex justify-between px-5 py-3 mx-auto items-center gap-4 mt-20'>
       <img src={assets.logo}></img>
       <p className='flex-1 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright @GreatStack.dev | all right reserved</p>
       <div className='flex gap-2.5'>
        <img width={38} src={assets.facebook_icon} alt="" />
        <img width={38}src={assets.twitter_icon} alt="" />
        <img width={38}src={assets.instagram_icon} alt="" />
       </div>
     </div>
   )
 }
 
 export default Footer
 