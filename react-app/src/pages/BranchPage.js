import React, { useState, useEffect } from 'react'
import axios from 'axios'
import config from '../Config'
import Post from '../components/Post'
import Comment from '../components/Comment'

function BranchPage({ match }) {
    const BranchId = match.params.branchId


    return (
        <>
            <div className="wall">
                Branch page
            </div>
            
            <style jsx="true">{`
                .wall {
                    width: 600px;
                    height: 400px;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                @media screen and (max-width: 700px) {
                    .wall {
                        width: 100%;
                    }
                }
                .create-comment-form {
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    flex-wrap: wrap;
                }
                .comments {
                    background-color: white;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.1);
                    width: 100%;
                    border-radius: 5px;
                    transition-property: background-color;
                    transition-duration: 2s;
                }
                .error {
                    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.6);
                }
            `}</style>
        </>
    )
}

export default BranchPage