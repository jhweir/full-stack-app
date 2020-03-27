import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import config from '../Config'
import { HolonContext } from '../contexts/HolonContext'

function PostPlaceholder() {
    return (
        <>
            <div className="ph-post">
                <div className="ph-post-shine"/>
                <div className="ph-post-id">
                    <div className="ph-post-id-block"/>
                </div>
                <div className="ph-post-body">
                    <div className="ph-post-tags mb-10">
                        {/* <span className="ph-user-thumbnail mr-10"/> */}
                        <img className="ph-user-thumbnail mr-10" src="/icons/user-image-00.jpg"/>
                        <span className="ph-post-tags-block-1 mr-10"/>
                        <span className="ph-post-tags-block-2"/>
                    </div>
                    <div className="ph-post-content">
                        <div className="ph-post-title-block mb-10"/>
                        <div className="ph-post-description-block mb-10"/>    
                        <div className="ph-post-interact">
                            <div className="ph-post-interact-item mr-10">
                                <div className="ph-post-interact-item-circle mr-10"/>
                                <div className="ph-post-interact-item-block"/>
                            </div>
                            <div className="ph-post-interact-item mr-10">
                                <div className="ph-post-interact-item-circle mr-10"/>
                                <div className="ph-post-interact-item-block"/>
                            </div>
                            <div className="ph-post-interact-item mr-10">
                                <div className="ph-post-interact-item-circle mr-10"/>
                                <div className="ph-post-interact-item-block"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .ph-post {
                    margin-bottom: 10px;
                    padding: 20px 30px 20px 30px;
                    width: 100%;
                    border-radius: 10px;
                    background-color: rgba(255,255,255,1);
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.05);
                    display: flex;
                    flex-direction: row;
                    position: relative;
                    overflow: hidden;
                }
                .ph-post-id {
                    width: 20px;
                    margin-left: -6px;
                    margin-right: 25px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    flex-shrink: 0;
                }
                .ph-post-id-block {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background-color: rgba(0,0,0,0.04);
                }
                @media screen and (max-width: 700px) {
                    .ph-post-id {
                        display: none;
                    }
                }
                .ph-post-body {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: flex-start;
                    overflow: hidden;
                }
                .ph-post-tags {
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .ph-user-thumbnail {
                    //background-image: url(/icons/user-image-00.jpg);
                    //background-position: center;
                    //background-size: cover;
                    //background-color: rgba(0,0,0,0.07);
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    flex-shrink: 0;
                    opacity: 0.5;
                }
                .ph-post-tags-block-1 {
                    height: 20px;
                    width: 150px;
                    background-color: rgba(0,0,0,0.07);
                }
                .ph-post-tags-block-2 {
                    height: 20px;
                    width: 100px;
                    background-color: rgba(0,0,0,0.03);
                }
                .ph-post-title-block {
                    height: 25px;
                    width: 300px;
                    background-color: rgba(0,0,0,0.07);
                }
                .ph-post-description-block {
                    height: 20px;
                    width: 430px;
                    background-color: rgba(0,0,0,0.07);
                }
                .ph-post-interact {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-shrink: 0;
                    flex-wrap: wrap;
                }
                .ph-post-interact-item {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    flex-shrink: 0;
                }
                .ph-post-interact-item-circle {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background-color: rgba(0,0,0,0.1);
                }
                .ph-post-interact-item-block {
                    height: 15px;
                    width: 60px;
                    background-color: rgba(0,0,0,0.05);
                }
            `}</style>
        </>
    )
}

export default PostPlaceholder