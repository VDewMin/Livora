import React from 'react'
import { PlusIcon } from 'lucide-react'
import { Link } from 'react-router'


const SDNavbar = () => {
  return <header className='bg-base-300 border-b border-base-content/10'>
        <div className='mx-auto max-w-6xl p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='text-3xl font-bold text-primary font-mono tracking-tight'>
                    Appointment
                </h1>
                <div className='flex items-center gap-4'>
                  <Link to= {"/create"} className='btn btn-primary'>
                  <PlusIcon className='size-5'/>
                  <span>New note</span>
                  </Link>
                  <Link to={"/purchases"} className='btn btn-secondary'>
                    <span>Purchases</span>
                  </Link>
                  <Link to={"/SDStaticSite.jsx"} className='btn btn-ghost'>
                    <span>Home</span>
                  </Link>

                </div>

            </div>
   
        </div>
    </header>
  
}

export default SDNavbar