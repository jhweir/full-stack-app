export const timeSinceCreated = (createdAt) => {
    let now = Date.parse(new Date())
    let dateCreated = Date.parse(createdAt)
    let difference = now - dateCreated
    let minute = 1000 * 60
    let hour = minute * 60
    let day = hour * 24
    let week = day * 7
    let year = day * 365
    let timeSinceCreated
    if (difference < hour) {
        let number = (difference / minute).toFixed(0)
        timeSinceCreated = `${number} minute${number > 1 ? 's' : ''} ago`
    }
    if (difference > hour && difference < day) {
        let number = (difference / hour).toFixed(0)
        timeSinceCreated = `${number} hour${number > 1 ? 's' : ''} ago`
    }
    if (difference > day && difference < week) {
        let number = (difference / day).toFixed(0)
        timeSinceCreated = `${number} day${number > 1 ? 's' : ''} ago`
    }
    if (difference > week && difference < year) {
        let number = (difference / week).toFixed(0)
        timeSinceCreated = `${number} week${number > 1 ? 's' : ''} ago`
    }
    if (difference > year) {
        let number = (difference / year).toFixed(0)
        timeSinceCreated = `${number} year${number > 1 ? 's' : ''} ago`
    }
    return timeSinceCreated
}

export const dateCreated = (createdAt) => {
    let date = new Date(createdAt)
    let d = date.toString().split(/[ :]/)
    let dateCreated = d[4]+':'+d[5]+' on '+d[2]+' '+d[1]+' '+d[3]
    return dateCreated
}
