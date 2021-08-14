import React from 'react'
import styles from '../styles/components/Stat.module.scss'
import { ReactComponent as UsersIconSVG } from '../svgs/users-solid.svg'
import { ReactComponent as PostIconSVG } from '../svgs/edit-solid.svg'
import { ReactComponent as CommentIconSVG } from '../svgs/comment-solid.svg'
import { ReactComponent as ReactionIconSVG } from '../svgs/fire-alt-solid.svg'

const Stat = (props: {
    type: string
    value: number
    title: string
    small?: boolean
    onClick?: () => void
}): JSX.Element => {
    const { type, value, title, small, onClick } = props

    let iconSVG
    if (type === 'user') iconSVG = <UsersIconSVG />
    if (type === 'post') iconSVG = <PostIconSVG />
    if (type === 'comment') iconSVG = <CommentIconSVG />
    if (type === 'reaction') iconSVG = <ReactionIconSVG />

    return (
        <div
            className={styles.wrapper}
            role='button'
            tabIndex={0}
            onClick={onClick}
            onKeyDown={onClick}
            title={`${value} ${title}`}
        >
            <div className={styles.icon}>{iconSVG}</div>
            <p>{value}</p>
            {!small && <p>{title}</p>}
        </div>
    )
}

Stat.defaultProps = {
    onClick: null,
    small: false,
}

export default Stat
