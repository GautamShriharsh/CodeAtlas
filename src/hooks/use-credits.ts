import { api } from '@/trpc/react'
import React, { useEffect } from 'react'



const useCredits = () => {
  
const { data: creditsData, isLoading } = api.project.getCredits.useQuery(undefined, {
  staleTime: 1000 * 60 * 5, 
  refetchOnWindowFocus: false,
});
    
const credits = creditsData?.credits


  return {
    credits,
    isLoading
  }
}

export default useCredits;
