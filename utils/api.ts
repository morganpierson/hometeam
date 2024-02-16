//generate URL for util api functions to query off of
const createURL = (path) => {
  return window.location.origin + path
}

export const fetchUserProfile = async (id) => {
  const res = await fetch(
    new Request(createURL(`/api/user/${id}`), {
      method: 'GET',
    })
  )
  if (res.ok) {
    const data = await res.json()
    console.log('OKAYYY DATA ', data)
    return data.data
  } else {
    console.log('NOOOO')
    throw new Error('Something went wrong on API server!')
  }
}

export const updateUserProfile = async (id, content) => {
  console.log('CONTENT', content)
  const res = await fetch(
    new Request(createURL(`/api/user/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    })
  )
  if (res.ok) {
    const data = await res.json()
    console.log(data.data)
    return data.data
  } else {
    throw new Error('Something went wrong on API server!')
  }
}