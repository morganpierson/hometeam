'use client'
import Select from 'react-select'

const SingleSelect = ({ options, name, classname, labelName }) => {
  return (
    <>
      <label htmlFor={name}>{labelName}</label>

      <Select
        options={options}
        name={name}
        classNames={{ control: () => classname }}
      />
    </>
  )
}

export default SingleSelect
