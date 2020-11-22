import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/NavBar.module.scss'

function NavBar() {
    const {
        isLoggedIn,
        accountData,
        setAuthModalOpen,
        userControlsModalOpen,
        setUserControlsModalOpen
    } = useContext(AccountContext)
    const { setHolonHandle } = useContext(HolonContext)

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarContainer}>
                <div className={styles.navBarLinks}>
                    <Link to="/"
                        className={styles.navBarLink}>
                        {/* <img className={styles.navBarIcon} src="/icons/home-solid.svg" alt=''/> */}
                        <div className={styles.navBarText}>Home</div>
                    </Link> |
                    <Link to="/s/all"
                        className={styles.navBarLink}
                        onClick={() => { setHolonHandle('all') }}>
                        {/* <img className={styles.navBarIcon} src="/icons/edit-solid.svg" alt=''/> */}
                        <div className={styles.navBarText}>Posts</div>
                    </Link> | 
                    <Link to="/s/all/spaces"
                        className={styles.navBarLink}
                        onClick={() => { setHolonHandle('all') }}>
                        {/* <img className={styles.navBarIcon} src="/icons/overlapping-circles-thick.svg" alt=''/> */}
                        <div className={styles.navBarText}>Spaces</div>
                    </Link> | 
                    <Link to="/s/all/users"
                        className={styles.navBarLink}
                        onClick={() => { setHolonHandle('all') }}>
                        {/* <img className={styles.navBarIcon} src="/icons/users-solid.svg" alt=''/> */}
                        <div className={styles.navBarText}>Users</div>
                    </Link>
                </div>
                {!isLoggedIn &&
                    <div className={styles.authButtons}>
                        <div className="button" onClick={() => setAuthModalOpen(true)}>
                            Log in
                        </div>
                    </div>
                }
                {isLoggedIn &&
                    <div className={styles.userControls} onClick={() => setUserControlsModalOpen(!userControlsModalOpen)}>
                        <span className={styles.userName}>{accountData.name}</span>
                        {accountData.flagImagePath
                            ? <img className={styles.userImage} src={accountData.flagImagePath}/>
                            : <div className={styles.userImageWrapper}>
                                <img className={styles.userImagePlaceholder} src='/icons/user-solid.svg' alt=''/>
                            </div>
                        }
                    </div>
                }
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