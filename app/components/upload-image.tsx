'use client'

import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function UploadImage({ uploadText, id, name }) {
  const [image, setImage] = useState('')
  function handleChange(e: any) {
    console.log(e.target.files)
    setImage(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <div className="mt-2 flex items-center gap-x-3">
      {image ? (
        <img src={image} className="h-16 w-16 rounded-full" />
      ) : (
        <UserCircleIcon
          className="h-16 w-16 text-gray-300"
          aria-hidden="true"
        />
      )}
      <label
        htmlFor="logo"
        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none  hover:text-indigo-500"
      >
        <span>{uploadText}</span>
        <input
          id={id}
          name={name}
          type="file"
          className="sr-only"
          onChange={handleChange}
        />
      </label>
    </div>
  )
}
