//generate URL for util api functions to query off of
const createURL = (path: string) => {
  return window.location.origin + path
}

export const fetchEmployeeProfile = async (id: string) => {
  const res = await fetch(
    new Request(createURL(`/api/user/${id}`), {
      method: 'GET',
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error('Something went wrong on API server!')
  }
}

// Legacy alias
export const fetchUserProfile = fetchEmployeeProfile

export const updateEmployeeProfile = async (id: string, content: Record<string, unknown>) => {
  const res = await fetch(
    new Request(createURL(`/api/user/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error('Something went wrong on API server!')
  }
}

// Legacy alias
export const updateUserProfile = updateEmployeeProfile

export const createNewOrg = async (formData: FormData) => {
  const res = await fetch(
    new Request(createURL('/api/org/create'), {
      method: 'POST',
      body: formData,
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error('Something went wrong on API server!')
  }
}

export const deleteEmployeeProfile = async (id: string, orgId: string) => {
  const res = await fetch(
    new Request(createURL(`/api/user/${id}`), {
      method: 'DELETE',
      body: JSON.stringify({ orgId }),
    })
  )
  if (res.ok) {
    const data = await res.json()
    return data.data
  } else {
    throw new Error('Something went wrong on API server!')
  }
}

// Legacy alias
export const deleteUserProfile = deleteEmployeeProfile
