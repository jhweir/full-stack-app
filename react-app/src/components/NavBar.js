import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/NavBar.module.scss'
import config from '../Config'
import SmallFlagImage from './SmallFlagImage'

function NavBar() {
    const {
        accountContextLoading,
        isLoggedIn,
        accountData,
        setAuthModalOpen,
        navBarDropDownModalOpen,
        setNavBarDropDownModalOpen,
        selectedNavBarItem,
        setSelectedNavBarItem
    } = useContext(AccountContext)
    const { setHolonHandle, fullScreen, setFullScreen } = useContext(HolonContext)

    useEffect(() => {
        console.log('path change')
        if (window.location.href === config.appURL || window.location.href.includes(`${config.appURL}?alert`)) setSelectedNavBarItem('home')
        else if (window.location.href === `${config.appURL}s/all/posts`) setSelectedNavBarItem('posts')
        else if (window.location.href === `${config.appURL}s/all/spaces`) setSelectedNavBarItem('spaces')
        else if (window.location.href === `${config.appURL}s/all/users`) setSelectedNavBarItem('users')
        else setSelectedNavBarItem('')
    }, [window.location.pathname])

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarContainer}>
                <div className={styles.navBarLinks}>
                    <Link to="/"
                        className={styles.navBarLink}
                        onClick={() => setSelectedNavBarItem('home')}>
                        {/* <img className={styles.navBarIcon} src="/icons/home-solid.svg" alt=''/> */}
                        <div className={`${styles.navBarText} ${selectedNavBarItem === 'home' && styles.selected}`}>Home</div>
                    </Link>
                    <Link to="/s/all"
                        className={styles.navBarLink}
                        onClick={() => { setSelectedNavBarItem('posts'); setHolonHandle('all') }}>
                        {/* <img className={styles.navBarIcon} src="/icons/edit-solid.svg" alt=''/> */}
                        <div className={`${styles.navBarText} ${selectedNavBarItem === 'posts' && styles.selected}`}>Posts</div>
                    </Link>
                    <Link to="/s/all/spaces"
                        className={styles.navBarLink}
                        onClick={() => { setSelectedNavBarItem('spaces'); setHolonHandle('all') }}>
                        {/* <img className={styles.navBarIcon} src="/icons/overlapping-circles-thick.svg" alt=''/> */}
                        <div className={`${styles.navBarText} ${selectedNavBarItem === 'spaces' && styles.selected}`}>Spaces</div>
                    </Link>
                    <Link to="/s/all/users"
                        className={styles.navBarLink}
                        onClick={() => { setSelectedNavBarItem('users'); setHolonHandle('all') }}>
                        {/* <img className={styles.navBarIcon} src="/icons/users-solid.svg" alt=''/> */}
                        <div className={`${styles.navBarText} ${selectedNavBarItem === 'users' && styles.selected}`}>Users</div>
                    </Link>
                </div>
                {!accountContextLoading && !isLoggedIn &&
                    <div className={styles.authButtons}>
                        <div className="button" onClick={() => setAuthModalOpen(true)}>
                            Log in
                        </div>
                    </div>
                }
                {!accountContextLoading && isLoggedIn &&
                    <div className={styles.userControls} onClick={() => setNavBarDropDownModalOpen(!navBarDropDownModalOpen)}>
                        <span className={styles.userName}>{accountData.name}</span>
                        <SmallFlagImage type='user' size={40} imagePath={accountData.flagImagePath}/>
                        {accountData.unseen_notifications > 0 &&
                            <div className={styles.notification}>{ accountData.unseen_notifications }</div>
                        }
                    </div>
                }
                <img
                    className={styles.expandButton}
                    title='Toggle full screen'
                    src={fullScreen ? '/icons/compress-solid.svg' : '/icons/expand-solid.svg'}
                    onClick={() => setFullScreen(!fullScreen)}
                />
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
    onClick={() => setHolonContextLoading(!holonContextLoading)}>
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
    //     setHolonContextLoading(true)
    //     //updateHolonContext('all')
    //     setTimeout(function() { 
    //         history.push(path)
    //         updateHolonContext('all')
    //     }, 500)
    //     // updateContext()
    //     // setTimeout(function() { history.push(path); updateHolonContext('all') }, 500)
    //     // history.push(path)
    // }


        // function navigate() {
    //     updateHolonContext('all')
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