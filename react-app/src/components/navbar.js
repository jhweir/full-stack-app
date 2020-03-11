import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BranchContext } from '../contexts/BranchContext'


function NavBar() {
    const { getBranchPosts } = useContext(BranchContext);

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    return (
        <>
            <div className="navbar">
                <Link to="/" className="navbar-text">Home</Link> |
                <Link to="/wall" className="navbar-text" onClick={ getBranchPosts }>Wall</Link> | 
                <Link to="/branches" className="navbar-text">Branches</Link>
                <div style={{ marginLeft: 20 }} className="button" onClick={ toggleDarkMode }>Dark mode</div>
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