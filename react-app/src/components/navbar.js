import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/NavBar.module.scss'

function NavBar() {
    const { updateHolonContext, isLoading, setIsLoading } = useContext(HolonContext);
    const { navBar, navBarContainer, navBarLinks, navBarLink, navBarIcon, navBarText } = styles

    // function toggleDarkMode() {
    //     document.body.classList.toggle("dark-mode"); // look into useRef
    // }

    return (
        <div className={navBar}>
            <div className={navBarContainer}>
                <div className={navBarLinks}>
                    <Link to="/"
                        className={navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={navBarIcon} src="/icons/home-solid.svg" alt=''/>
                        <div className={navBarText}>Home</div>
                    </Link> |
                    <Link to="/h/root"
                        className={navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={navBarIcon} src="/icons/globe-americas-solid.svg" alt=''/>
                        <div className={navBarText}>Wall</div>
                    </Link> | 
                    <Link to="/h/root/child-spaces"
                        className={navBarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={navBarIcon} src="/icons/overlapping-circles-thick.svg" alt=''/>
                        <div className={navBarText}>Spaces</div>
                    </Link>
                </div>
                <div 
                    style={{marginLeft: 20}}
                    className="button"
                    onClick={() => setIsLoading(!isLoading)}>
                    Toggle loading
                </div>
            </div>
        </div>
    )
}

export default NavBar

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