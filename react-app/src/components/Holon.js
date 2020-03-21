import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { PostContext } from '../contexts/PostContext'
import { HolonContext } from '../contexts/HolonContext'

function Holon(props) {
    //const { reRender } = useContext(HolonContext)

    return (
        <>
            <div className="holon">
                <Link to={ `/h/${props.holon.handle}/child-holons` } className="holon-title" onClick={ () => { props.updateContext() } }>{props.holon.name}</Link>
                <span className="sub-text mr-10">{props.holon.description}</span>
            </div>

            <style jsx="true">{`
                .holon {
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

export default Holon