import React, { useState } from 'react'

export const App = ({ text }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    // style={{ background: '#a7b3a6', padding: '20px', borderRadius: '5px' }}
    <div className="bg-red-100 p-5 rounded-md">
      <p>{text}</p>
      <button
        className="btn"
        onClick={() => {
          setIsActive(!isActive)
        }}
      >
        {isActive ? 'Скрыть элемент' : 'Показать элемент'}
      </button>
      {isActive && (
        <div>
          <br />
          <div className="hideElem">Скрытый элемент</div>
        </div>
      )}
    </div>
  )
}
