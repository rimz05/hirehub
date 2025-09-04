import {useNavigate} from 'react-router-dom'

const JobCart = ({job}) => {
  const navigate = useNavigate();
  return (
    <div className='p-6 border border-gray-300 shadow-xl rounded '>
      <div className=' flex justify-between items-center'>
        <img className='h-8' src={job.companyId.image} alt=""/>
      </div>
      <h4 className='font-medium text-xl my-3'>{job.title}</h4>
      <div className='flex gap-3 text-sm items-center'>
        <span className='bg-blue-200 border border-blue-400 items-center px-4 py-1 rounded'>{job.location}</span>
        <span className=' bg-red-200 border border-red-400 items-center px-4 py-1 rounded'>{job.level}</span>
      </div>
      <p className='text-gray-500 text-sm mt-4' dangerouslySetInnerHTML={{__html:job.description.slice(0,150)}}></p>
      <div className='flex gap-4 text-sm mt-4'>
        <button onClick = {()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}}  className='bg-blue-500 text-white px-4  py-2 rounded'>Apply Now</button>
        <button onClick = {()=>{navigate(`/apply-job/${job._id}`); scrollTo(0,0)}} className='border border-blue-500 text-blue-500 px-4 py-2 rounded'>Learn More</button>
      </div>
    </div>
  )
}

export default JobCart
