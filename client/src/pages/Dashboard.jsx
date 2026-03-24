import {FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {
  
  const {user,token} = useSelector(state => state.auth)

  const colors =["#9333ea","#d97706","#dc2626","#0284c7","#16a34a"]
  const[allResumes,setAllResumes]=useState([])
  const[showCreateResume,setshowCreateResume]=useState(false)
  const[showUploadResume,setshowUploadResume]=useState(false)
  const[title,setTitle]=useState('')
  const[resume,setResume]=useState(null)
  const[editResumeId,setEditResumeId]=useState('')

  const [isLoading,setIsLoading] = useState(false)
  const navigate=useNavigate()

  const loadAllResumes = async()=>{
    try {
       const {data}= await api.get('/api/users/resumes',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event)=>{
    try {
      event.preventDefault()
      
      if (!title.trim()) {
        return toast.error("Please enter a resume title")
      }
      
      setIsLoading(true)
      
      const {data}= await api.post('/api/resumes/create',{title},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if (data && data.resume && data.resume._id) {
        setAllResumes(prev => [data.resume, ...prev])
        setTitle('')
        setshowCreateResume(false)
        toast.success("Resume created successfully!")
        navigate(`/app/builder/${data.resume._id}`)
      } else {
        toast.error("Failed to create resume")
      }

    } catch (error) {
      console.error('Create error:', error)
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadResume=async(event)=>{
    event.preventDefault()

    if(!resume){
      return toast.error("Please select a file")
    }

    setIsLoading(true)

    try {
      const resumeText = await pdfToText(resume)
      console.log("TEXT:", resumeText);

  if (!resumeText || !resumeText.trim()) {
    throw new Error("Empty resume text");
  }
      const {data}= await api.post('/api/ai/upload-resume',{title,resumeText}, {
        headers:{
          Authorization:`Bearer ${token}`
          
        }
      })
      setTitle('')
      setResume(null)
      setshowUploadResume(false)

      navigate(`/app/builder/${data.resumeId}`)

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const editTitle = async(event)=>{
    try {
      event.preventDefault()

      const { data } = await api.put(
        `/api/resumes/update`,
        {
          resumeId: editResumeId,
          resumeData: { title }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setAllResumes(prev =>
        prev.map(resume =>
          resume._id=== editResumeId
            ? {...resume,title}
            : resume
        )
      )

      setTitle('')
      setEditResumeId('')
      toast.success("Title updated successfully")

    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this resume?')

      if (confirmDelete) {
        const {data}= await api.delete(`/api/resumes/delete/${resumeId}`, {
          headers:{
            Authorization:`Bearer ${token}`
          }
        })

        setAllResumes(prev =>
          prev.filter(resume=>resume._id!==resumeId)
        )

        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(()=>{
     if(token) {
       loadAllResumes()
     }
  },[token])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>

         <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
           Welcome, {user?.name}
         </p>
         
         <div className='flex gap-4'>
             <button onClick={()=>setshowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <PlusIcon className='size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full'/>
              <p className='text-sm group-hover:text-indigo-600'>Create Resume</p>
             </button>

             <button onClick={()=>setshowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <UploadCloudIcon className='size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'/>
              <p className='text-sm group-hover:text-purple-600'>Upload Existing</p>
             </button>
         </div>

         <hr className='border-slate-300 my-6 sm:w-[305px]'/>

         <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
           {allResumes.length === 0 ? (
             <p className="text-gray-500 col-span-full text-center py-8">
               No resumes yet. Click "Create Resume" to get started!
             </p>
           ) : (
             allResumes.map((resume,index)=>{
               const baseColor = colors[index % colors.length];
               return (
                <button key={resume._id} onClick={()=>navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer' style={{background: `linear-gradient(135deg, ${baseColor}10,${baseColor}40)`,borderColor:baseColor+'40'}}>
                      <FilePenLineIcon className="size-7" style={{color:baseColor}}/>
                      <p className='text-sm px-2 text-center' style={{color:baseColor}}>
                        {resume.title}
                      </p>

                      <div onClick={e=>e.stopPropagation()} className='absolute top-1 right-1 hidden group-hover:flex items-center'>
                       <TrashIcon onClick={() => deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded cursor-pointer"/>
                       <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded cursor-pointer"/>
                      </div>
                </button>
               )
             })
           )}
         </div>

         {/* Upload Resume Modal */}
         {showUploadResume && (
            <form onSubmit={uploadResume} onClick={()=> setshowUploadResume(false)} className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
              <div onClick={e => e.stopPropagation()} className='bg-white rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl mb-4'>Upload Resume</h2>

                <input 
                  onChange={(e)=>setTitle(e.target.value)} 
                  value={title} 
                  type='text' 
                  placeholder='Enter resume title' 
                  className='w-full px-4 py-2 mb-4 border rounded' 
                  required
                />

                <input 
                  type="file" 
                  accept='.pdf' 
                  onChange={(e)=>setResume(e.target.files[0])} 
                  className='mb-4'
                />

                <button type="submit" className='w-full py-2 bg-green-600 text-white rounded mt-2'>
                  {isLoading ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            </form>
         )}

         {/* Edit Title Modal */}
         {editResumeId && (
            <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
              <div onClick={e => e.stopPropagation()} className='bg-white rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl mb-4'>Edit Resume Title</h2>

                <input 
                  onChange={(e)=>setTitle(e.target.value)} 
                  value={title} 
                  type='text' 
                  placeholder='Enter resume title' 
                  className='w-full px-4 py-2 mb-4 border rounded' 
                  required
                />

                <button className='w-full py-2 bg-green-600 text-white rounded'>
                  Update
                </button>
              </div>
            </form>
         )}

         {/* ✅ CREATE RESUME MODAL - THIS WAS MISSING */}
         {showCreateResume && (
            <div onClick={() => setshowCreateResume(false)} className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
              <form onSubmit={createResume} onClick={e => e.stopPropagation()} className='bg-white rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl mb-4'>Create New Resume</h2>
                
                <input 
                  onChange={(e) => setTitle(e.target.value)} 
                  value={title} 
                  type='text' 
                  placeholder='Enter resume title' 
                  className='w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                  required
                  autoFocus
                  disabled={isLoading}
                />
                
                <div className='flex gap-2'>
                  <button 
                    type="button" 
                    onClick={() => {
                      setshowCreateResume(false)
                      setTitle('')
                    }} 
                    className='flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition'
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isLoading || !title.trim()} 
                    className='flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isLoading ? "Creating..." : "Create Resume"}
                  </button>
                </div>
              </form>
            </div>
         )}

      </div>
    </div>
  )
}

export default Dashboard