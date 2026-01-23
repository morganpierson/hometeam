'use client'
import { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

interface ToggleButtonProps {
  header: string
  subHeader: string
}

export default function ToggleButton({ header, subHeader }: ToggleButtonProps) {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch.Group as="div" className="flex items-center">
      <span className="flex flex-grow flex-col">
        <Switch.Label
          as="span"
          className="text-sm font-medium leading-6 text-indigo-600"
          passive
        >
          {header}
        </Switch.Label>
        <Switch.Description as="span" className="text-sm text-gray-500">
          {subHeader}
        </Switch.Description>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 ml-6 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 mb-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
