export function isPlural(value: number): boolean {
    return value < 1 || value > 1
}

export function pluralise(value: number): string {
    return value < 1 || value > 1 ? 's' : ''
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
        time = `${number} second${pluralise(number)} ago`
    }
    if (difference >= minute && difference < hour) {
        const number = Number((difference / minute).toFixed(0))
        time = `${number} minute${pluralise(number)} ago`
    }
    if (difference >= hour && difference < day) {
        const number = Number((difference / hour).toFixed(0))
        time = `${number} hour${pluralise(number)} ago`
    }
    if (difference >= day && difference < week) {
        const number = Number((difference / day).toFixed(0))
        time = `${number} day${pluralise(number)} ago`
    }
    if (difference >= week && difference < year) {
        const number = Number((difference / week).toFixed(0))
        time = `${number} week${pluralise(number)} ago`
    }
    if (difference >= year) {
        const number = Number((difference / year).toFixed(0))
        time = `${number} year${pluralise(number)} ago`
    }
    return time
}

export function onPageBottomReached(set: (payload: boolean) => void): void {
    const offset = 150
    const d = document.documentElement
    if (d.scrollHeight - d.scrollTop - offset < d.clientHeight) set(true)
    else set(false)
}

export function onElementBottomReached(id: string, set: (payload: boolean) => void): void {
    const element = document.getElementById(id) as HTMLElement
    const { scrollTop, clientHeight, scrollHeight } = element
    const offset = 10
    const height = scrollHeight - clientHeight
    const bottomReached = scrollTop + offset > height
    set(bottomReached)
}

export function allValid(items: any, setItems: (newItems: any) => void): boolean {
    let valid = true
    const newItems = { ...items }
    Object.keys(newItems).forEach((itemKey) => {
        const item = newItems[itemKey]
        const errors = item.required ? item.validate(item.value) : []
        item.state = errors.length ? 'invalid' : 'valid'
        item.errors = errors
        if (errors.length) valid = false
    })
    setItems(newItems)
    return valid
}

export const notNull = (value: number | null): number | false => (value !== null ? value : false)

export const defaultErrorState = {
    required: true,
    errors: [] as string[],
    state: 'default' as 'default' | 'valid' | 'invalid',
}

export function statTitle(text: string, value: number): string {
    return `${value} ${text}${pluralise(value)}`
}
