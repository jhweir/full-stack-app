export const timeSinceCreated = (createdAt: string): string => {
    const now = Date.parse(new Date().toString())
    const dateCreated = Date.parse(createdAt)
    const difference = now - dateCreated
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const year = day * 365

    let time
    if (difference < minute) {
        const number = Number((difference / second).toFixed(0))
        time = `${number} second${number > 1 ? 's' : ''} ago`
    }
    if (difference >= minute && difference < hour) {
        const number = Number((difference / minute).toFixed(0))
        time = `${number} minute${number > 1 ? 's' : ''} ago`
    }
    if (difference >= hour && difference < day) {
        const number = Number((difference / hour).toFixed(0))
        time = `${number} hour${number > 1 ? 's' : ''} ago`
    }
    if (difference >= day && difference < week) {
        const number = Number((difference / day).toFixed(0))
        time = `${number} day${number > 1 ? 's' : ''} ago`
    }
    if (difference >= week && difference < year) {
        const number = Number((difference / week).toFixed(0))
        time = `${number} week${number > 1 ? 's' : ''} ago`
    }
    if (difference >= year) {
        const number = Number((difference / year).toFixed(0))
        time = `${number} year${number > 1 ? 's' : ''} ago`
    }
    return time
}

export const dateCreated = (createdAt: string): string => {
    const sourceDate = new Date(createdAt)
    const d = sourceDate.toString().split(/[ :]/)
    const date = `${d[4]}:${d[5]} on ${d[2]} ${d[1]} ${d[3]}`
    return date
}

export const resizeTextArea = (target: HTMLElement): void => {
    const t = target
    t.style.height = ''
    t.style.height = `${target.scrollHeight}px`
}
