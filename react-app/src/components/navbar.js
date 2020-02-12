import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PostContext } from '../contexts/PostContext'


function NavBar(props) {
    const { getPosts } = useContext(PostContext);

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
    }

    return (
        <div className="navbar">
            <Link to="/" className="navbar-text">Home</Link> |
            <Link to="/wall" className="navbar-text" onClick={ getPosts }> Wall</Link>
            <div style={{ marginLeft: 20 }} className="button" onClick={ toggleDarkMode }>Dark mode</div>

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
        </div>
    )
}

export default NavBar