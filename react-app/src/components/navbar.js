import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { HolonContext } from '../contexts/HolonContext'


function NavBar() {
    const { updateContext } = useContext(HolonContext);

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    return (
        <>
            <div className="navbar">
                <div className="navbar-container">
                    <div className="navbar-container-links">
                        <Link 
                            to="/"
                            className="navbar-text">
                            Home
                        </Link> |
                        <Link 
                            to="/h/root/wall"
                            className="navbar-text"
                            onClick={ updateContext }>
                            Wall
                        </Link> | 
                        <Link 
                            to="/h/root/child-holons"
                            className="navbar-text"
                            onClick={ updateContext }>
                            Holons
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
                    color: white;
                    width: 100%;
                    height: 60px;
                    background-color: #222;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    transition-property: background-color;
                    transition-duration: 2s;
                }
                .navbar-container {
                    width: 600px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .navbar-text {
                    color: white;
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