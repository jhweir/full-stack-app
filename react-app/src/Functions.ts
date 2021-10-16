// function updateValueInStoreObject(object, setObject, key, payload) {
//     setObject({ ...object, [key]: payload })
// }

import Cookies from 'universal-cookie'

export function isPlural(value: number): boolean {
    if (value < 1 || value > 1) return true
    return false
}

export function resizeTextArea(target: HTMLElement): void {
    const t = target
    t.style.height = ''
    t.style.height = `${target.scrollHeight}px`
}

export function dateCreated(createdAt: string | undefined): string | undefined {
    if (createdAt === undefined) return undefined
    const sourceDate = new Date(createdAt)
    const d = sourceDate.toString().split(/[ :]/)
    const date = `${d[4]}:${d[5]} on ${d[2]} ${d[1]} ${d[3]}`
    return date
}

export function timeSinceCreated(createdAt: string | undefined): string | undefined {
    if (createdAt === undefined) return undefined
    const now = Date.parse(new Date().toString())
    const createdAtDate = Date.parse(createdAt)
    const difference = now - createdAtDate
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const year = day * 365

    let time
    if (difference < minute) {
        const number = Number((difference / second).toFixed(0))
        time = `${number} second${isPlural(number) ? 's' : ''} ago`
    }
    if (difference >= minute && difference < hour) {
        const number = Number((difference / minute).toFixed(0))
        time = `${number} minute${isPlural(number) ? 's' : ''} ago`
    }
    if (difference >= hour && difference < day) {
        const number = Number((difference / hour).toFixed(0))
        time = `${number} hour${isPlural(number) ? 's' : ''} ago`
    }
    if (difference >= day && difference < week) {
        const number = Number((difference / day).toFixed(0))
        time = `${number} day${isPlural(number) ? 's' : ''} ago`
    }
    if (difference >= week && difference < year) {
        const number = Number((difference / week).toFixed(0))
        time = `${number} week${isPlural(number) ? 's' : ''} ago`
    }
    if (difference >= year) {
        const number = Number((difference / year).toFixed(0))
        time = `${number} year${isPlural(number) ? 's' : ''} ago`
    }
    return time
}

export function onPageBottomReached(set: (payload: boolean) => void): void {
    const offset = 150
    const d = document.documentElement
    if (d.scrollHeight - d.scrollTop - offset < d.clientHeight) set(true)
    else set(false)
}
