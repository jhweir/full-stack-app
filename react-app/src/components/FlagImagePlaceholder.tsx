import React from 'react'
import styles from '@styles/components/FlagImagePlaceholder.module.scss'
import Row from '@components/Row'
import { ReactComponent as UserIconSVG } from '@svgs/user-solid.svg'
import { ReactComponent as UsersIconSVG } from '@svgs/users-solid.svg'
import { ReactComponent as PostIconSVG } from '@svgs/edit-solid.svg'

const FlagImagePlaceholder = (props: { type: 'space' | 'user' | 'post' }): JSX.Element => {
    const { type } = props

    let iconSVG
    let iconWidth
    switch (type) {
        case 'space':
            iconSVG = <UsersIconSVG />
            iconWidth = '60%'
            break
        case 'user':
            iconSVG = <UserIconSVG />
            iconWidth = '45%'
            break
        case 'post':
            iconSVG = <PostIconSVG />
            iconWidth = '50%'
            break
        default:
            iconSVG = null
            iconWidth = null
    }

    return (
        <Row centerX centerY className={styles.wrapper}>
            <Row centerX centerY style={{ width: iconWidth }}>
                {iconSVG}
            </Row>
        </Row>
    )
}

export default FlagImagePlaceholder
