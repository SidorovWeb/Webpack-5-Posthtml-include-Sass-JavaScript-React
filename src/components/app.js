import React, { useState } from 'react'

export const App = ({ text }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <div style={{ background: '#a7b3a6', padding: '20px', borderRadius: '5px' }}>
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
