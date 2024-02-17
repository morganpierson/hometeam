'use client'
import MultiSelectComponent from './multiselect'
import SingleSelect from './single-select'
import { createNewOrg } from '@/utils/actions'
import { useFormState } from 'react-dom'

const CreatOrgForm = ({ companySize, industryOptions }) => {
  const [state, formAction] = useFormState(createNewOrg, {
    name: '',
    size: '',
    industries: [],
  })

  return (
    <div className="flex justify-center items-center">
      <form action={formAction} className="flex flex-col">
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
          <SingleSelect
            name={'orgIndustries'}
            labelName={'Company Industry'}
            options={industryOptions}
            classname={'w-96 h-auto mt-2 mb-4'}
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
            className="rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Org
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreatOrgForm
