'use client'
import Select from 'react-select'

interface Option {
  value: string
  label: string
}

interface SingleSelectProps {
  options: Option[]
  name: string
  classname?: string
  labelName: string
}

const SingleSelect = ({ options, name, classname, labelName }: SingleSelectProps) => {
  return (
    <>
      <label htmlFor={name}>{labelName}</label>

      <Select
        options={options}
        name={name}
        classNames={{ control: () => classname || '' }}
      />
    </>
  )
}

export default SingleSelect
