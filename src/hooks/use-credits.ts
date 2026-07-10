import { api } from '@/trpc/react'
import React, { useEffect } from 'react'



const useCredits = () => {
  
const {data: creditsData, isLoading} = api.project.getCredits.useQuery() 
    
const credits = creditsData?.credits


  return {
    credits,
    isLoading
  }
}

export default useCredits;
