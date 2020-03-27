import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HolonContext } from '../contexts/HolonContext'


function NavBar(props) {
    const { updateHolonContext } = useContext(HolonContext);

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className="navbar-container-links">
                        <Link className="navbar-link"
                            to="/"
                            onClick={ () => { updateHolonContext('root') } }
                            >
                            <img className="navbar-icon" src="/icons/home-solid.svg"/>
                            <div className="navbar-text">Home</div>
                        </Link> |
                        <Link className="navbar-link"
                            to="/h/root/wall"
                            onClick={ () => { updateHolonContext('root') } }
                            >
                            <img className="navbar-icon" src="/icons/globe-americas-solid.svg"/>
                            <div className="navbar-text">Wall</div>
                        </Link> | 
                        <Link  className="navbar-link"
                            to="/h/root/child-holons"
                            onClick={ () => { updateHolonContext('root') } }
                            >
                            <img className="navbar-icon" src="/icons/overlapping-circles-thick.svg"/>
                            <div className="navbar-text">Spaces</div>
                        </Link>
                    </div>
                    <div 
                        style={{ marginLeft: 20 }}
                        className="button"
                        onClick={ toggleDarkMode }>
                        Dark mode
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .navbar {
                    background-color: #212937;
                    color: #fff;
                    width: 100%;
                    height: 60px;
                    position: fixed;
                    top: 0;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    transition-property: background-color;
                    transition-duration: 2s;
                    z-index: 10;
                }
                .navbar-container {
                    width: 1200px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .navbar-container-links {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .navbar-link {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .navbar-text {
                    color: #fff;
                    font-size: 24px;
                    font-weight: 400;
                    text-decoration: none;
                    padding: 10px;
                }
                .navbar-icon {
                    width: 28px;
                    height: 28px;
                    margin-left: 10px;
                    opacity: 1;
                    filter: invert(100%);
                }
            `}</style>
        </>
    )
}

export default NavBar

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