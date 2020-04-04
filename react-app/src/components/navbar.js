import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { HolonContext } from '../contexts/HolonContext'
import styles from '../styles/components/NavBar.module.scss'

function NavBar() {
    const { updateHolonContext, isLoading, setIsLoading } = useContext(HolonContext);
    const { navbar, navbarContainer, blue, navbarContainerLinks, navbarLink, navbarIcon, navbarText } = styles

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode"); // look into useRef
    }

    return (
        <div className={navbar}>
            <div className={navbarContainer}>
                <div className={navbarContainerLinks}>
                    <Link to="/"
                        className={navbarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={navbarIcon} src="/icons/home-solid.svg"/>
                        <div className={navbarText}>Home</div>
                    </Link> |
                    <Link to="/h/root/wall"
                        className={navbarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={navbarIcon} src="/icons/globe-americas-solid.svg"/>
                        <div className={navbarText}>Wall</div>
                    </Link> | 
                    <Link to="/h/root/child-holons"
                        className={navbarLink}
                        onClick={() => { updateHolonContext('root') }}>
                        <img className={navbarIcon} src="/icons/overlapping-circles-thick.svg"/>
                        <div className={navbarText}>Spaces</div>
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

{/* <div 
    style={{ marginLeft: 20 }}
    className="button"
    onClick={ toggleDarkMode }>
    Dark mode
</div> */}



{/* <div className="navbar-text" 
        onClick={() => redirectTo('/h/root/wall', 'root')}>
        Wall
    </div> |
    <div className="navbar-text"
        onClick={() => redirectTo('/h/root/child-holons', 'root')}>
        Child-holons
    </div> */}





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