export const timeSinceCreated = (createdAt) => {
    const now = Date.parse(new Date())
    const dateCreated = Date.parse(createdAt)
    const difference = now - dateCreated
    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const year = day * 365
    
    let timeSinceCreated
    if (difference < minute) {
        let number = (difference / second).toFixed(0)
        timeSinceCreated = `${number} second${number > 1 ? 's' : ''} ago` // `${number}s`
    }
    if (difference >= minute && difference < hour) {
        let number = (difference / minute).toFixed(0)
        timeSinceCreated = `${number} minute${number > 1 ? 's' : ''} ago` // `${number}m`
    }
    if (difference >= hour && difference < day) {
        let number = (difference / hour).toFixed(0)
        timeSinceCreated = `${number} hour${number > 1 ? 's' : ''} ago` // `${number}h`
    }
    if (difference >= day && difference < week) {
        let number = (difference / day).toFixed(0)
        timeSinceCreated = `${number} day${number > 1 ? 's' : ''} ago` // `${number}d`
    }
    if (difference >= week && difference < year) {
        let number = (difference / week).toFixed(0)
        timeSinceCreated = `${number} week${number > 1 ? 's' : ''} ago` // `${number}w`
    }
    if (difference >= year) {
        let number = (difference / year).toFixed(0)
        timeSinceCreated = `${number} year${number > 1 ? 's' : ''} ago` // `${number}y`
    }
    return timeSinceCreated
}

export const dateCreated = (createdAt) => {
    let date = new Date(createdAt)
    let d = date.toString().split(/[ :]/)
    let dateCreated = d[4]+':'+d[5]+' on '+d[2]+' '+d[1]+' '+d[3]
    return dateCreated
}

export const resizeTextArea = (target) => {
    target.style.height = ''
    target.style.height = target.scrollHeight + 'px'
}