import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AccountContext } from '@contexts/AccountContext'
import styles from '@styles/components/Navbar.module.scss'
import config from '@src/Config'
import FlagImage from '@components/FlagImage'
// import ImageTitle from '@components/ImageTitle'
import Button from '@components/Button'
import { ReactComponent as NotificationIconSVG } from '@svgs/bell-solid.svg'
// import { ReactComponent as MessageIconSVG } from '@svgs/envelope-solid.svg'
import { ReactComponent as SettingsIconSVG } from '@svgs/cog-solid.svg'

const Navbar = (): JSX.Element => {
    const {
        loggedIn,
        accountData,
        setLogInModalOpen,
        navBarDropDownModalOpen,
        setNavbarDropDownModalOpen,
    } = useContext(AccountContext)
    // const { fullScreen, setFullScreen } = useContext(SpaceContext)

    const [exploreDropDownOpen, setExploreDropDownOpen] = useState(false)
    const [selectedNavbarItem, setSelectedNavbarItem] = useState('')

    useEffect(() => {
        const url = window.location.href
        if (url === `${config.appURL}/` || url.includes(`${config.appURL}?alert`))
            setSelectedNavbarItem('home')
        else if (url === `${config.appURL}/s/all/posts`) setSelectedNavbarItem('posts')
        else if (url === `${config.appURL}/s/all/spaces`) setSelectedNavbarItem('spaces')
        else if (url === `${config.appURL}/s/all/users`) setSelectedNavbarItem('users')
        else setSelectedNavbarItem('')
    }, [window.location.pathname])

    return (
        <div className={styles.wrapper}>
            <div className={styles.navBarLinks}>
                {/* <HamburgerIconSVG width={40} height={40} color='red'/> */}
                <Link to='/' className={styles.navBarLink}>
                    {/* <img className={styles.navBarIcon} src='/icons/home-solid.svg' alt='' /> */}
                    <div
                        className={`${styles.navBarText} ${
                            selectedNavbarItem === 'home' && styles.selected
                        }`}
                    >
                        Home
                    </div>
                </Link>

                <Link to='/features' className={styles.navBarLink}>
                    <div className={styles.navBarText}>Features</div>
                </Link>
                <Link to='/coop' className={styles.navBarLink}>
                    <div className={styles.navBarText}>Coop</div>
                </Link>
                <div
                    className={styles.navBarLink}
                    onMouseEnter={() => setExploreDropDownOpen(true)}
                    onMouseLeave={() => setExploreDropDownOpen(false)}
                >
                    <div className={styles.navBarText}>Explore</div>
                    <img
                        className={styles.exploreDropDownIcon}
                        src='/icons/chevron-down-solid.svg'
                        alt=''
                    />
                    {exploreDropDownOpen && (
                        <div className={styles.exploreDropDown}>
                            <Link to='/s/all/posts' className={styles.exploreDropDownItem}>
                                <img
                                    className={styles.navBarIcon}
                                    src='/icons/edit-solid.svg'
                                    alt=''
                                />
                                <div className={styles.dropDownText}>Posts</div>
                            </Link>
                            <Link to='/s/all/spaces' className={styles.exploreDropDownItem}>
                                <img
                                    className={styles.navBarIcon}
                                    src='/icons/overlapping-circles-thick.svg'
                                    alt=''
                                />
                                <div className={styles.dropDownText}>Spaces</div>
                            </Link>
                            <Link to='/s/all/people' className={styles.exploreDropDownItem}>
                                <img
                                    className={styles.navBarIcon}
                                    src='/icons/users-solid.svg'
                                    alt=''
                                />
                                <div className={styles.dropDownText}>People</div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            {/* <div className={styles.searchBarWrapper}>Search bar</div> */}
            {loggedIn ? (
                <div className={styles.accountButtons}>
                    {/* <Link to={`/u/${accountData.handle}/messages`} className={styles.accountButton}>
                        <MessageIconSVG />
                        {accountData.unseen_messages > 0 && (
                            <div className={styles.unseenItems}>{accountData.unseen_messages}</div>
                        )}
                    </Link> */}
                    <Link
                        to={`/u/${accountData.handle}/notifications`}
                        className={styles.accountButton}
                    >
                        <NotificationIconSVG />
                        {accountData.unseen_notifications > 0 && (
                            <div className={styles.unseenItems}>
                                {accountData.unseen_notifications}
                            </div>
                        )}
                    </Link>
                    <Link to={`/u/${accountData.handle}/settings`} className={styles.accountButton}>
                        <SettingsIconSVG />
                    </Link>
                    <button
                        type='button'
                        className={styles.profileButton}
                        onClick={() => setNavbarDropDownModalOpen(!navBarDropDownModalOpen)}
                    >
                        <FlagImage type='user' size={40} imagePath={accountData.flagImagePath} />
                        {/* <span className={styles.userName}>{accountData.name}</span> */}
                    </button>
                </div>
            ) : (
                <Button text='Log in' color='blue' onClick={() => setLogInModalOpen(true)} />
            )}
        </div>
    )
}

export default Navbar

// function toggleDarkMode() {
//     document.body.classList.toggle("dark-mode"); // look into useRef
// }
/* <div 
    style={{marginLeft: 20}}
    className="button"
    onClick={() => setSpaceContextLoading(!spaceContextLoading)}>
    Toggle loading
</div> */

/* <div 
    style={{ marginLeft: 20 }}
    className="button"
    onClick={ toggleDarkMode }>
    Dark mode
</div> */

/* <div className="navBar-text" 
        onClick={() => redirectTo('/s/all', 'all')}>
        SpacePagePosts
    </div> |
    <div className="navBar-text"
        onClick={() => redirectTo('/s/all/spaces', 'all')}>
        Child-holons
    </div> */

// function redirect(path) {
//     setSpaceContextLoading(true)
//     //updateSpaceContext('all')
//     setTimeout(function() {
//         history.push(path)
//         updateSpaceContext('all')
//     }, 500)
//     // updateContext()
//     // setTimeout(function() { history.push(path); updateSpaceContext('all') }, 500)
//     // history.push(path)
// }

// function navigate() {
//     updateSpaceContext('all')
// }

// function delayedRedirect() {
// history.push('/');
// props.context.router.history.push("/some/Path");
// browserHistory.push('/')
// }

// function delayRedirect(event) {
//     const { history: { push } } = this.props;
//     event.preventDefault();
//     setTimeout(()=>push(to), 1000);
// }
// const delay = new Promise((resolve, reject) => {
//     setTimeout(resolve, 3000, 'success');
// });

/* <div
    className={styles.expandButtonWrapper}
    role='button'
    tabIndex={0}
    onClick={() => setFullScreen(!fullScreen)}
    onKeyDown={() => setFullScreen(!fullScreen)}
>
    <img
        className={styles.expandButton}
        title='Toggle full screen'
        src={fullScreen ? '/icons/compress-solid.svg' : '/icons/expand-solid.svg'}
        aria-label='test'
    />
</div> */
