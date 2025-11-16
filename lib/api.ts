const API_BASE = 'https://rwfwi3e0uk.execute-api.us-east-1.amazonaws.com/dev'

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Store token in localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken')
  }
  return null
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() && { 'Authorization': `Bearer ${getToken()}` }),
})

// Auth endpoints
export const authApi = {
  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password, role: 'student' }),
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json()
    if (data.token) {
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return data
  },

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : null
    }
    return null
  },
}

// Student incidents endpoints
export const studentIncidentsApi = {
  // Create new incident
  create: async (incidentData: {
    type: string
    location: string
    description: string
    urgency: string
  }) => {
    const response = await fetch(`${API_BASE}/student/incidents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(incidentData),
    })
    return response.json()
  },

  // List all incidents (for reference/context)
  listAll: async () => {
    const response = await fetch(`${API_BASE}/student/incidents`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return response.json()
  },

  // Get my incidents only
  getMine: async () => {
    const response = await fetch(`${API_BASE}/student/incidents/mine`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return response.json()
  },

  // Get incident detail by ID
  getDetail: async (id: string) => {
    const response = await fetch(`${API_BASE}/student/incidents/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return response.json()
  },

  // Upload attachments
  uploadAttachment: async (incidentId: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE}/student/incidents/${incidentId}/attachments`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` },
      body: formData,
    })
    return response.json()
  },

  // Validate location
  validateLocation: async (location: string) => {
    const response = await fetch(`${API_BASE}/student/incidents/validate-location`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ location }),
    })
    return response.json()
  },

  // Preview incident before submitting
  preview: async (incidentData: any) => {
    const response = await fetch(`${API_BASE}/student/incidents/preview`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(incidentData),
    })
    return response.json()
  },

  // Get basic stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/student/incidents/stats/basic`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return response.json()
  },
}
