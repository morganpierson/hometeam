'use client'
import { useState } from 'react'
import Select, { MultiValue } from 'react-select'

interface Option {
  value: string
  label: string
}

interface MultiSelectComponentProps {
  options: Option[]
  classname?: string
  name: string
  labelName: string
  selectedOptions: MultiValue<Option>
  handleSelectChange: (selected: MultiValue<Option>) => void
}

const MultiSelectComponent = ({
  options,
  classname,
  name,
  labelName,
  selectedOptions,
  handleSelectChange,
}: MultiSelectComponentProps) => {
  return (
    <div>
      <label htmlFor={name}>{labelName}</label>
      <Select
        options={options}
        isMulti
        value={selectedOptions}
        onChange={handleSelectChange}
        className={classname}
        name={name}
      />
    </div>
  )
}

export default MultiSelectComponent
