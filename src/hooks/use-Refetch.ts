import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import React from 'react'

const useRefetch = () => {
  const queryClient = useQueryClient()

 return async (targetKey?: QueryKey) => {
    if (targetKey) {
      await queryClient.refetchQueries({ queryKey: targetKey });
    }
    else {
      await queryClient.refetchQueries();
    }
  }
}

export default useRefetch;
