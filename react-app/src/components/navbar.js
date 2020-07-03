import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/NavBar.module.scss'
import AuthModal from './AuthModal'
import UserControlsModal from './UserControlsModal'
import axios from 'axios'
import config from '../Config'
//var _ = require('lodash')

function NavBar() {
    const { updateHolonContext, isLoading, setIsLoading } = useContext(HolonContext)
    const { accountData, setAccountData, logOut } = useContext(AccountContext)

    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [userControlsModalOpen, setUserControlsModalOpen] = useState(false)
    //const [isAuth, setIsAuth] = useState(false)

    // function logOut() {
    //     axios.get(config.environmentURL + `/log-out`)
    // }

    // function checkAuth() {
    //     axios
    //         .get(config.environmentURL + `/check-auth`)
    //         .then(res => {
    //             console.log(res)
    //             //setIsAuth()
    //         })
    // }

    return (
        <div className={styles.navBar}>
            <div className={styles.navBarContainer}>
                <div className={styles.navBarLinks}>
                    <Link to="/"
                        className={styles.navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={styles.navBarIcon} src="/icons/home-solid.svg" alt=''/>
                        <div className={styles.navBarText}>Home</div>
                    </Link> |
                    <Link to="/h/root"
                        className={styles.navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={styles.navBarIcon} src="/icons/globe-americas-solid.svg" alt=''/>
                        <div className={styles.navBarText}>Wall</div>
                    </Link> | 
                    <Link to="/h/root/child-spaces"
                        className={styles.navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={styles.navBarIcon} src="/icons/overlapping-circles-thick.svg" alt=''/>
                        <div className={styles.navBarText}>Spaces</div>
                    </Link> | 
                    <Link to="/h/root/users"
                        className={styles.navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={styles.navBarIcon} src="/icons/users-solid.svg" alt=''/>
                        <div className={styles.navBarText}>Users</div>
                    </Link>
                </div>
                {!accountData &&
                    <div className={styles.authButtons}>
                        <div className="button" onClick={() => setAuthModalOpen(true)}>
                            Log in
                        </div>
                    </div>
                }
                {authModalOpen && 
                    <AuthModal setAuthModalOpen={setAuthModalOpen}/>
                }
                {accountData &&
                    <div className={styles.userControls} onClick={() => setUserControlsModalOpen(true)}>
                        <span className={styles.userName}>{accountData.name}</span>
                        {accountData.profileImagePath ?
                            <img className={styles.userImage} src={accountData.profileImagePath}/> :
                            <div className={styles.userImageWrapper}>
                                <img className={styles.userImagePlaceholder} src='/icons/user-solid.svg' alt=''/>
                            </div>
                        }
                    </div>
                }
                {userControlsModalOpen && 
                    <UserControlsModal
                        setUserControlsModalOpen={setUserControlsModalOpen}
                        setAccountData={setAccountData}
                        accountData={accountData}
                        logOut={logOut}
                    />
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
    onClick={() => setIsLoading(!isLoading)}>
    Toggle loading
</div> */

/* <div 
    style={{ marginLeft: 20 }}
    className="button"
    onClick={ toggleDarkMode }>
    Dark mode
</div> */



/* <div className="navBar-text" 
        onClick={() => redirectTo('/h/root', 'root')}>
        Wall
    </div> |
    <div className="navBar-text"
        onClick={() => redirectTo('/h/root/child-spaces', 'root')}>
        Child-holons
    </div> */





        // function redirect(path) {
    //     setIsLoading(true)
    //     //updateHolonContext('root')
    //     setTimeout(function() { 
    //         history.push(path)
    //         updateHolonContext('root')
    //     }, 500)
    //     // updateContext()
    //     // setTimeout(function() { history.push(path); updateHolonContext('root') }, 500)
    //     // history.push(path)
    // }


        // function navigate() {
    //     updateHolonContext('root')
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