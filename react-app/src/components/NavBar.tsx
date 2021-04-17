import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SpaceContext } from '../contexts/SpaceContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/NavBar.module.scss'
import config from '../Config'
import SmallFlagImage from './SmallFlagImage'

const NavBar = (): JSX.Element => {
    const {
        accountContextLoading,
        isLoggedIn,
        accountData,
        setAuthModalOpen,
        navBarDropDownModalOpen,
        setNavBarDropDownModalOpen,
        selectedNavBarItem,
        setSelectedNavBarItem,
    } = useContext(AccountContext)
    const { setSpaceHandle, fullScreen, setFullScreen } = useContext(SpaceContext)

    useEffect(() => {
        if (
            window.location.href === `${config.appURL}/` ||
            window.location.href.includes(`${config.appURL}?alert`)
        )
            setSelectedNavBarItem('home')
        else if (window.location.href === `${config.appURL}/s/all/posts`)
            setSelectedNavBarItem('posts')
        else if (window.location.href === `${config.appURL}/s/all/spaces`)
            setSelectedNavBarItem('spaces')
        else if (window.location.href === `${config.appURL}/s/all/users`)
            setSelectedNavBarItem('users')
        else setSelectedNavBarItem('')
    }, [window.location.pathname])

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarContainer}>
                <div className={styles.navBarLinks}>
                    <Link
                        to='/'
                        className={styles.navBarLink}
                        onClick={() => setSelectedNavBarItem('home')}
                    >
                        {/* <img className={styles.navBarIcon} src="/icons/home-solid.svg" alt=''/> */}
                        <div
                            className={`${styles.navBarText} ${
                                selectedNavBarItem === 'home' && styles.selected
                            }`}
                        >
                            Home
                        </div>
                    </Link>
                    <Link
                        to='/s/all/spaces'
                        className={styles.navBarLink}
                        onClick={() => {
                            setSelectedNavBarItem('spaces')
                            setSpaceHandle('all')
                        }}
                    >
                        {/* <img className={styles.navBarIcon} src="/icons/overlapping-circles-thick.svg" alt=''/> */}
                        <div
                            className={`${styles.navBarText} ${
                                selectedNavBarItem === 'spaces' && styles.selected
                            }`}
                        >
                            Spaces
                        </div>
                    </Link>
                    <Link
                        to='/s/all'
                        className={styles.navBarLink}
                        onClick={() => {
                            setSelectedNavBarItem('posts')
                            setSpaceHandle('all')
                        }}
                    >
                        {/* <img className={styles.navBarIcon} src="/icons/edit-solid.svg" alt=''/> */}
                        <div
                            className={`${styles.navBarText} ${
                                selectedNavBarItem === 'posts' && styles.selected
                            }`}
                        >
                            Posts
                        </div>
                    </Link>
                    <Link
                        to='/s/all/users'
                        className={styles.navBarLink}
                        onClick={() => {
                            setSelectedNavBarItem('users')
                            setSpaceHandle('all')
                        }}
                    >
                        {/* <img className={styles.navBarIcon} src="/icons/users-solid.svg" alt=''/> */}
                        <div
                            className={`${styles.navBarText} ${
                                selectedNavBarItem === 'users' && styles.selected
                            }`}
                        >
                            Users
                        </div>
                    </Link>
                </div>
                {!accountContextLoading && !isLoggedIn && (
                    <div className={styles.authButtons}>
                        <div
                            className='button'
                            role='button'
                            tabIndex={0}
                            onClick={() => setAuthModalOpen(true)}
                            onKeyDown={() => setAuthModalOpen(true)}
                        >
                            Log in
                        </div>
                    </div>
                )}
                {!accountContextLoading && isLoggedIn && (
                    <div
                        className={styles.userControls}
                        onClick={() => setNavBarDropDownModalOpen(!navBarDropDownModalOpen)}
                        onKeyDown={() => setNavBarDropDownModalOpen(!navBarDropDownModalOpen)}
                        role='button'
                        tabIndex={0}
                    >
                        <span className={styles.userName}>{accountData.name}</span>
                        <SmallFlagImage
                            type='user'
                            size={40}
                            imagePath={accountData.flagImagePath}
                        />
                        {accountData.unseen_notifications > 0 && (
                            <div className={styles.notification}>
                                {accountData.unseen_notifications}
                            </div>
                        )}
                    </div>
                )}
                <div
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
                </div>
            </div>
        </div>
    )
}

export default NavBar

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
        HolonPagePosts
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
