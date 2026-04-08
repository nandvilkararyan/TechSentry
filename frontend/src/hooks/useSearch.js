import { useQuery } from '@tanstack/react-query'

export const useSearch = (query, options = {}) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return null
      
      const params = new URLSearchParams({
        q: query,
        type: 'all',
        year_from: '2000',
        year_to: '2024',
        page: 1
      })
      
      const response = await fetch(`/api/search/?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled: query.trim().length > 0,
    ...options
  })
}

export const useTechnologyProfile = (query, options = {}) => {
  return useQuery({
    queryKey: ['technology-profile', query],
    queryFn: async () => {
      if (!query.trim()) return null
      
      const response = await fetch(`/api/technology/profile/?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Failed to fetch technology profile')
      return response.json()
    },
    enabled: query.trim().length > 0,
    ...options
  })
}
