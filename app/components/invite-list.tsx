'use client'
import { useState } from 'react'
import ListContainer from './list-container'

interface EmailListInputProps {
  name: string
  email: string
  setEmail: (e: React.ChangeEvent<HTMLInputElement>) => void
  emailList: string[]
  handleAddEmail: () => void
  handleRemoveEmail: (email: string) => void
}

const EmailListInput = ({
  name,
  email,
  setEmail,
  emailList,
  handleAddEmail,
  handleRemoveEmail,
}: EmailListInputProps) => {
  return (
    <div>
      <div className="flex flex-col">
        <label htmlFor="employeeList">Invite Employees</label>
        <div className="flex items-center">
          <input
            type="email"
            id="employeeList"
            placeholder="Enter email address"
            value={email}
            onChange={setEmail}
            className="border border-[#cccccc] rounded-sm w-72 h-10 my-2 px-2 invalid:border-pink-500 invalid:text-pink-600
            "
          />
          <button
            className="h-8 w-8 rounded-full bg-purple-400 ml-4 text-white disabled:opacity-25"
            disabled={email === ''}
            onClick={handleAddEmail}
          >
            +
          </button>
        </div>
      </div>
      <ListContainer
        items={emailList}
        handleRemoveEmail={handleRemoveEmail}
        name={name}
      />
    </div>
  )
}

export default EmailListInput
