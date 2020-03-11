import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { PostContext } from '../contexts/PostContext'

function Branch(props) {

    return (
        <>
            <div className="branch">
                <Link to={ `/b/${props.branch.handle}` } className="branch-title">{props.branch.name}</Link>
                <span className="sub-text mr-10">{props.branch.description}</span>
            </div>

            <style jsx="true">{`
                .branch {
                    margin-bottom: 10px;
                    padding: 20px 30px 20px 30px;
                    width: 100%;
                    border-radius: 5px;
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.1);
                    display: flex;
                    flex-direction: row;
                    transition-property: background-color;
                    transition-duration: 2s;
                    position: relative;
                }
            `}</style>
        </>
    )
}

export default Branch