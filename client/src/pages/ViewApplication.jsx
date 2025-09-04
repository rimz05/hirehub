import React from 'react';
import { assets, viewApplicationsPageData } from '../assets/assets';

const ViewApplication = () => {
  console.log(viewApplicationsPageData);

  return (
    <div className='container mx-suto p-4'>
      <table className='w-full max-w-4xl border border-gray-200 max:sm:text-sm'>
        <thead>
          <tr className='bg-gray-100 border-b'>
            <th className='py-2 px-4 text-left'>#</th>
            <th className='py-2 px-4 text-left'>User Name</th>
            <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
            <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
            <th className='py-2 px-4 text-left'>Resume</th>
            <th className='py-2 px-4 text-left'>Action</th>
          </tr>
        </thead>
        <tbody>
          {viewApplicationsPageData.map((applicant, index) => (
            <tr key={index} className='text-gray-700 border-b'>
              <td className='py-2 px-4  text-center'>{index + 1}</td>
              <td className='py-2 px-4  text-center flex'>
                <img className='w-10 h-10 rounded-full mr-3 max-sm:hidden' src={applicant.imgSrc} alt='applicant' />
                <span className='py-2 px-4 '>{applicant.name}</span>
              </td>

              <td className='py-2 px-4  max-sm:hidden'>{applicant.jobTitle}</td>

              <td className='py-2 px-4  max-sm:hidden'>{applicant.location}</td>

              <td className='py-2 px-4'>
                <a 
                href={applicant.resumeLink} target='_blank' rel='noopener noreferrer' className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'>
                  Resume Image
                  <img src={assets.resume_download_icon} alt='Download Icon' className='w-4 h-4' />
                </a>
              </td>
              <td className='py-2 px-4 relative'>
                <div className='relative inline-block text-left group'>
                  <button className='text-gray-500 p-1 rounded action-button'>...</button>
                  <div className='absolute hidden group-hover:block right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow z-10'>
                    <button className='block px-4 py-2 hover:bg-green-100 w-full'>Accept</button>
                    <button className='block px-4 py-2 hover:bg-red-100 w-full'>Reject</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplication;
