import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from '@styles/components/SidebarSmall.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import FlagImage from '@components/FlagImage'
import Column from '@components/Column'
import { ReactComponent as PlusIconSVG } from '@svgs/plus.svg'

const Item = (props: { data: any }): JSX.Element => {
    const { data } = props
    const { selectedSpaceSubPage } = useContext(SpaceContext)
    return (
        <Link to={`/s/${data.handle}/${selectedSpaceSubPage || 'posts'}`}>
            <FlagImage type={data.type} size={50} imagePath={data.flagImagePath} />
        </Link>
    )
}

const SidebarSmall = (): JSX.Element => {
    const { accountData, loggedIn } = useContext(AccountContext)

    useEffect(() => {
        console.log('SidebarSmall render')
        // todo: get root space data
    }, [])

    return (
        <div className={`${styles.wrapper} hide-scrollbars`}>
            <Item
                data={{
                    type: 'space',
                    handle: 'all',
                    flagImagePath: 'https://weco-prod-space-flag-images.s3.eu-west-1.amazonaws.com/1614556880362',
                }}
            />
            <div className={styles.divider} />
            <Column className={`${styles.section} hide-scrollbars`}>
                {accountData.FollowedHolons.map((space) => (
                    <Item
                        key={space.id}
                        data={{
                            type: 'space',
                            handle: space.handle,
                            flagImagePath: space.flagImagePath,
                        }}
                    />
                ))}
                <button className={styles.followSpaceButton} type='button'>
                    <PlusIconSVG />
                </button>
            </Column>
        </div>
    )
    // }
    // return null
}

export default SidebarSmall
