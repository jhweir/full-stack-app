import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from '@styles/components/PageTabs.module.scss'
import Row from '@components/Row'
import { SpaceContext } from '@contexts/SpaceContext'
import { UserContext } from '@contexts/UserContext'
import { ReactComponent as SettingsIconSVG } from '@svgs/cog-solid.svg'

const PageTabs = (props: { tabs: any }): JSX.Element => {
    const { tabs } = props
    const location = useLocation()
    const subpage = location.pathname.split('/')[3]

    return (
        <Row spaceBetween className={styles.wrapper}>
            {tabs.left.length > 0 && (
                <Row>
                    {tabs.left
                        .filter((t) => t.visible)
                        .map((tab) => (
                            <Link
                                to={`${tabs.baseRoute}/${tab.text.toLowerCase()}`}
                                className={`${styles.tab} ${tab.selected && styles.selected}`}
                            >
                                <p>{tab.text}</p>
                            </Link>
                        ))}
                </Row>
            )}
            {tabs.right.length > 0 && (
                <Row>
                    {tabs.right
                        .filter((t) => t.visible)
                        .map((tab) => (
                            <Link
                                to={`${tabs.baseRoute}/${tab.text.toLowerCase()}`}
                                className={`${styles.tab} ${
                                    subpage === tab.text.toLowerCase() && styles.selected
                                }`}
                            >
                                {tab.icon}
                                <p>{tab.text}</p>
                            </Link>
                        ))}
                </Row>
            )}
        </Row>
    )
}

export default PageTabs
