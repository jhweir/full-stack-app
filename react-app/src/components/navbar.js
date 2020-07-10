import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import { AccountContext } from '../contexts/AccountContext'
import styles from '../styles/components/NavBar.module.scss'

function NavBar() {
    const { updateHolonContext } = useContext(HolonContext)
    const { accountData, setAuthModalOpen, setUserControlsModalOpen } = useContext(AccountContext)

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
                        <div className={styles.navBarText}>Posts</div>
                    </Link> | 
                    <Link to="/h/root/spaces"
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
                {!accountData.id &&
                    <div className={styles.authButtons}>
                        <div className="button" onClick={() => setAuthModalOpen(true)}>
                            Log in
                        </div>
                    </div>
                }
                {accountData.id &&
                    <div className={styles.userControls} onClick={() => setUserControlsModalOpen(true)}>
                        <span className={styles.userName}>{accountData.name}</span>
                        {accountData.profileImagePath
                            ? <img className={styles.userImage} src={accountData.profileImagePath}/>
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
        onClick={() => redirectTo('/h/root/spaces', 'root')}>
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