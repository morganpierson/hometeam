'use client'
import { useState } from 'react'
import Select from 'react-select'

const MultiSelectComponent = ({
  options,
  classname,
  name,
  labelName,
  selectedOptions,
  handleSelectChange,
}) => {
  // const [selectedOptions, setSelectedOptions] = useState([])

  // const handleSelectChange = (selectedValues) => {
  //   setSelectedOptions(selectedValues)
  // }

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
