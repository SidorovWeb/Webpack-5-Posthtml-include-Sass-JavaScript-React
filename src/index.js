import React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { App } from './components/App'
import './main.css'
import './scss/main.scss'
import modal from './components/modal/modal'

// React
const root = document.getElementById('root')
if (root) {
    const RDC = ReactDOMClient.createRoot(root)
    RDC.render(
        <React.StrictMode>
            <App text="Компонент добавлен с помощью React 18" />
        </React.StrictMode>
    )
}

// JavaScript
const ready = () => {
    const btn = document.querySelector('.js-btn')
    const body = document.body
    if (btn) {
        btn.addEventListener('click', () => {
            if (body.classList.contains('text-red')) {
                btn.innerHTML = 'Добавить класс с помощью JS'
            } else {
                btn.innerHTML = 'Убрать класс с помощью JS'
            }
            body.classList.toggle('text-red')
        })
    }

    modal({
        name: '.modal-1',
        trigger: '.modal-1-trigger',
        closes: '.modal__close',
        beforeOpen: () => {
            console.log('Opening...')
        },
        beforeClose: () => {
            console.log('Closing...')
        },
    })
}

document.addEventListener('DOMContentLoaded', ready)
