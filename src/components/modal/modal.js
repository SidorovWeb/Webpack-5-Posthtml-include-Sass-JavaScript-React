const isScrollLock = (isActive) => {
    const html = document.documentElement

    if (isActive) {
        html.style.top = -window.pageYOffset + 'px'
        html.setAttribute('data-yoffset', window.pageYOffset)
        html.classList.add('scroll-lock')
    } else {
        const yOffset = html.getAttribute('data-yoffset')
        html.removeAttribute('data-yoffset')
        html.classList.remove('scroll-lock')
        window.scrollTo(0, yOffset)
        html.style.top = ''
    }
}

const focusElements = () => {
    return [
        'a[href]',
        'area[href]',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
        'select:not([disabled]):not([aria-hidden])',
        'textarea:not([disabled]):not([aria-hidden])',
        'button:not([disabled]):not([aria-hidden])',
        'iframe',
        'object',
        'embed',
        '[contenteditable]',
        '[tabindex]:not([tabindex^="-"])',
    ]
}

const isScroll = (height) => {
    var d = document,
        b = d.body,
        e = d.documentElement,
        c = 'client' + height
    height = 'scroll' + height
    return /CSS/.test(d.compatMode) ? e[c] < e[height] : b[c] < b[height]
}

const bodyScrollControl = () => {
    const html = document.documentElement

    if (!html.classList.contains('scroll-lock')) {
        let marginSize = window.innerWidth - html.clientWidth
        if (marginSize) {
            html.style.position = 'fixed'
            html.style.right = '0'
            html.style.left = '0'
            html.style.overflow = 'hidden'
            html.style.marginRight = marginSize + 'px'
        }
    } else {
        html.style.position = ''
        html.style.right = ''
        html.style.left = ''
        html.style.overflow = ''
        html.style.marginRight = ''
    }
}

export default function modal({ name, trigger, closes, beforeOpen, beforeClose }) {
    const modal = document.querySelector(name)
    const triggers = document.querySelectorAll(trigger)
    const closeBtns = document.querySelectorAll(closes)
    const beforeO = beforeOpen
    const beforeC = beforeClose

    if (!modal) {
        throw new Error(`На странице нет элемента с классом ${name}`)
    }

    if (!triggers.length) {
        throw new Error(`На странице нет элемента с классом  ${trigger}`)
    }
    if (!triggers.length) {
        throw new Error(`На странице нет элемента с классом  ${closes}`)
    }

    const modals = document.querySelectorAll('.modal')

    const listeners = () => {
        triggers.forEach((t) => t.addEventListener('click', open))

        closeBtns.forEach((b) => b.addEventListener('click', close))

        modal.addEventListener('keydown', keydown)

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains(name.slice(1))) {
                close()
            }
        })
    }

    const open = () => {
        if (beforeO) {
            beforeO()
        }

        modals.forEach((m) => {
            m.classList.remove('modal-open')
            m.classList.remove('modal-close')
        })

        modal.classList.add('modal-open')

        if (isScroll('Height')) {
            bodyScrollControl()
        }
        isScrollLock(true)

        const nodes = modal.querySelectorAll(focusElements())

        if (nodes.length) {
            setTimeout(() => {
                nodes[0].focus()
            }, 100)
        }
    }

    const close = () => {
        modal.classList.add('modal-close')
        modals.forEach((m) => m.classList.remove('modal-open'))

        bodyScrollControl()
        isScrollLock(false)
        setTimeout(() => {
            document.querySelector(trigger).focus()
        }, 10)

        const forms = modal.querySelectorAll('form')
        if (forms) {
            forms.forEach((f) => {
                f.reset()
            })
        }

        if (beforeC) {
            beforeC()
        }
    }

    const keydown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault()
            close()
            setTimeout(() => {
                document.querySelector(trigger).focus()
            }, 10)
        }

        if (e.key === 'Tab') {
            focusCatcher(e)
        }
    }

    const focusCatcher = (e) => {
        const nodes = modal.querySelectorAll(focusElements())
        const nodesArray = Array.prototype.slice.call(nodes)

        if (!modal.contains(document.activeElement)) {
            e.preventDefault()
            nodesArray[0].focus()
        } else {
            const focusedItemIndex = nodesArray.indexOf(document.activeElement)

            if (e.shiftKey && focusedItemIndex === 0) {
                setTimeout(() => {
                    nodesArray[nodesArray.length - 1].focus()
                }, 0)
            }
            if (!e.shiftKey && focusedItemIndex === nodesArray.length - 1) {
                nodesArray[0].focus()
                e.preventDefault()
            }
        }
    }

    const init = () => {
        listeners()
    }

    init()
}
