'use client'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import EditTeamForm from './edit-org-form'

const EditTeamModal = ({
  open,
  setOpen,
  org,
  teamData,
}: {
  open: boolean
  setOpen: (value: boolean) => void
  org: any
  teamData: any
}) => {
  //const [open, setOpen] = useState(true)

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-scroll mt-3 w-full">
          <div className="flex min-h-vh items-end justify-center p-4 text-center sm:items-center sm:p-0 mb-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-scroll rounded-lg bg-white px-4 pb-4 mb-6 text-left shadow-xl transition-all  sm:w-7/12 sm:p-10 sm:max-h-vh">
                <EditTeamForm
                  saveOrg={() => setOpen(false)}
                  cancelSave={() => setOpen(false)}
                  org={org}
                  teamData={teamData}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default EditTeamModal
