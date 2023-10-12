'use client'

const ListContainer = ({ items, handleRemoveEmail, name }) => {
  return (
    <div className="container mt-4 w-72">
      <ul name={name}>
        {items.map((item, index) => (
          <li
            key={index}
            className="border-b border-gray-200 py-2 flex justify-between"
          >
            {item}
            <button className="ml-2 text-red-500" onClick={handleRemoveEmail}>
              x
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ListContainer
