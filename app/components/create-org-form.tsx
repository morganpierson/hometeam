'use client'

import EmailListInput from './invite-list'
import MultiSelectComponent from './multiselect'
import SingleSelect from './single-select'
import { createNewOrg } from '@/utils/actions'
import { useState } from 'react'
import styles from '@/tailwind.config'

const CreatOrgForm = ({ companySize, industryOptions }) => {
  const [selectedIndustryOptions, setSelectedIndustryOptions] = useState([])
  const [email, setEmail] = useState('')
  const [emailList, setEmailList] = useState([])

  const handleSelectChange = (selectedValues) => {
    setSelectedIndustryOptions(selectedValues)
  }

  return (
    <div className="flex justify-center items-center">
      <form action={createNewOrg} method="post" className="flex flex-col">
        <div className="flex flex-col">
          <label htmlFor="orgName">Company Name</label>
          <input
            type="text"
            id="orgName"
            name="orgName"
            className="border focus:border-2 border-gray_light rounded-md h-10 my-2 px-2 w-96 focus:outline-none focus:border-blue"
          />
        </div>
        <div className="flex flex-col pt-6">
          <SingleSelect
            name={'orgSize'}
            classname={
              'w-96 h-10 my-2 border-gray_light focus:border-blue focus:outline-none'
            }
            options={companySize}
            labelName={'Company Size'}
          />
        </div>
        <div className="flex flex-col pt-6">
          <MultiSelectComponent
            name={'orgIndustries'}
            labelName={'Company Industries'}
            options={industryOptions}
            classname={'w-96 h-auto mt-2 mb-4'}
            handleSelectChange={handleSelectChange}
            selectedOptions={selectedIndustryOptions}
          />
        </div>
        {/* <div className="flex flex-col pt-6">
          <EmailListInput
            name={'employeeList'}
            setEmail={(e) => setEmail(e.target.value)}
            handleAddEmail={handleAddEmail}
            handleRemoveEmail={handleRemoveEmail}
            emailList={emailList}
          />
        </div> */}
        <div className="pt-4 flex justify-end w-96 col-start-2">
          <button
            type="submit"
            className="bg-blue text-white w-24 h-12 rounded-md"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatOrgForm
