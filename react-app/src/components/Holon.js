import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { PostContext } from '../contexts/PostContext'
import { HolonContext } from '../contexts/HolonContext'

function Holon(props) {
    const { setIsLoading, updateContext, updateHolonContext } = useContext(HolonContext)

    // function navigate() {
    //     updateHolonContext(props.holon.handle)
    //     //setIsLoading(true)
    //     //updateContext()
    // }

    return (
        <>
            <div className="holon-card">
                <Link className="holon-image"
                    to={ `/h/${props.holon.handle}/child-holons` }
                    onClick={ () => { updateHolonContext(props.holon.handle) } }
                    >
                    <img className="holon-image" src="/images/holon-flag-image-00.jpg"/>
                </Link>
                {/* <img className="holon-image" src="/images/holon-flag-image-00.jpg"/> */}
                <div className='holon-info'>
                    <Link className="holon-title"
                        to={ `/h/${props.holon.handle}/child-holons` }
                        onClick={ () => { updateHolonContext(props.holon.handle) } }
                        >
                        {props.holon.name}
                    </Link>
                    <span className="sub-text mr-10">{props.holon.description}</span>
                </div>
            </div>

            <style jsx="true">{`
                .holon-card {
                    margin-bottom: 10px;
                    padding: 20px;
                    width: 100%;
                    border-radius: 10px;
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.05);
                    display: flex;
                    flex-direction: row;
                    transition-property: background-color;
                    transition-duration: 2s;
                    position: relative;
                }
                .holon-image {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    margin-right: 20px;
                }
                .holon-info {
                    display: flex;
                    flex-direction: column;
                }
                .holon-title {
                    font-size: 24px;
                }
                .holon-title:visited {
                    color: black;
                }
            `}</style>
        </>
    )
}

export default Holon