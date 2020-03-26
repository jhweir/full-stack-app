import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { HolonContext } from '../contexts/HolonContext'


function NavBar(props) {
    const { updateContext, setIsLoading, updateHolonContext, redirectTo } = useContext(HolonContext);

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    let history = useHistory();

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

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className="navbar-container-links">
                        <Link className="navbar-text"
                            to="/"
                            onClick={ () => { updateHolonContext('root') } }
                            >
                            Home
                        </Link> |
                        {/* <div className="navbar-text" 
                            onClick={() => redirectTo('/h/root/wall', 'root')}>
                            Wall
                        </div> |
                        <div className="navbar-text"
                            onClick={() => redirectTo('/h/root/child-holons', 'root')}>
                            Child-holons
                        </div> */}
                        <Link className="navbar-text"
                            to="/h/root/wall"
                            onClick={ () => { updateHolonContext('root') } }
                            >
                            Wall
                        </Link> | 
                        <Link className="navbar-text"
                            to="/h/root/child-holons"
                            onClick={ () => { updateHolonContext('root') } }
                            >
                            Spaces
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
                    background-color: rgba(255, 255, 255, 0.3);
                    color: #222;
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
                .navbar-text {
                    color: #454551;
                    font-size: 24px;
                    font-weight: 600;
                    text-decoration: none;
                    padding: 10px;
                }
            `}</style>
        </>
    )
}

export default NavBar