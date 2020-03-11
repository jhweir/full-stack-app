import React, { useContext, useState, useEffect } from 'react'
import { BranchContext } from '../contexts/BranchContext'
import axios from 'axios'
import config from '../Config'
import BranchTagInput from './BranchTagInput'

function CreateBranch(props) {
    const { branchData, globalData, getBranchBranches, isLoading } = useContext(BranchContext);
    // const [user, setUser] = useState('')
    const [name, setName] = useState('')
    const [handle, setHandle] = useState('')
    const [description, setDescription] = useState('')
    const [parentBranchId, setParentBranchId] = useState('')
    const [nameError, setNameError] = useState(false)
    const [handleError, setHandleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [parentBranchIdError, setParentBranchIdError] = useState('')

    function submitBranch(e) {
        e.preventDefault()
        if (name === '') { setNameError(true) }
        if (handle === '') { setHandleError(true) }
        if (description === '') { setDescriptionError(true) }
        if (name && handle && description !== '') {
            const branchTags = branchData.Tags
            const branch = { name, handle, description, branchTags, parentBranchId }
            axios({ method: 'post', url: config.environmentURL + `/createBranch`, data: { branch } })
                // .then(res => { console.log(res) })
                .then(props.toggleModal())
                // .then(setTimeout(() => { getBranchBranches() }, 100))
        }
    }

    return (
        <>
            <div className="modal-wrapper">
                <div className="create-branch-modal hide-scrollbars">
                    <span className="post-title">Create a new branch</span>
                    <form className="create-branch-form" onSubmit={ submitBranch }> 
                        <input className={"input-wrapper modal mb-20 " + (nameError && 'error')}
                            type="text"
                            placeholder="Branch name..."
                            value={ name }
                            onChange={(e) => {
                                setName(e.target.value)
                                setNameError(false)
                            }}
                        />
                        <input className={"input-wrapper modal mb-20 " + (handleError && 'error')}
                            type="text"
                            placeholder="Unique handle..."
                            value={ handle }
                            onChange={(e) => {
                                setHandle(e.target.value)
                                setHandleError(false)
                            }}
                        />
                        <textarea className={"input-wrapper modal mb-20 " + (descriptionError && 'error')}
                            style={{ height:'auto', paddingTop:10 }}
                            rows="5"
                            type="text"
                            placeholder="Description..."
                            value={ description }
                            onChange={(e) => {
                                setDescription(e.target.value)
                                setDescriptionError(false)
                            }}
                        />
                        <textarea className={"input-wrapper modal mb-20 " + (parentBranchIdError && 'error')}
                            style={{ height:'auto', paddingTop:10 }}
                            rows="5"
                            type="text"
                            placeholder="Parent branch ID..."
                            value={ parentBranchId }
                            onChange={(e) => {
                                setParentBranchId(e.target.value)
                                setParentBranchIdError(false)
                            }}
                        />
                        <div className="button-container">
                            <button className="button">Create Branch</button>
                            <div className="button" onClick={ props.toggleModal }>Cancel</div>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx="true">{`
                .modal-wrapper {
                    padding: 20px;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.4);
                    z-index: 1;
                    animation-name: fade-in;
                    animation-duration: 0.5s;
                }
                .create-branch-modal {
                    position: absolute;
                    top: 150px;
                    left: calc(50% - 250px);
                    width: 500px;
                    padding: 40px;
                    background-color: white;
                    box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
                    border-radius: 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow: scroll;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .create-post-modal::-webkit-scrollbar {
                    display: none;
                }
                @media screen and (max-width: 700px) {
                    .create-post-modal {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        top: auto;
                        left: auto;
                    }
                }
                .create-branch-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .input-wrapper {
                    font-size: 14px;
                    outline: none;
                    border: none;
                    background-color: white;
                    height: 40px;
                    width: 400px;
                    border-radius: 5px;
                    padding: 0px 15px;
                    margin-right: 10px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    box-shadow: 0 1px 10px 0 rgba(10, 8, 72, 0.1);
                    transition-property: box-shadow, background-color;
                    transition-duration: 0.3s, 2s;
                }
                .input-wrapper:hover {
                    box-shadow: 0 0 5px 6px rgba(58,136,240,0.4);
                }
                @media screen and (max-width: 700px) {
                    .input-wrapper {
                        width: 100%;
                        // position: relative;
                        // top: auto;
                        // left: auto;
                    }
                }
                .input {
                    font-size: 14px;
                    outline: none;
                    border: none;
                }
                .button-container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .error {
                    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.6);
                }
            `}</style>
        </>
    )
}

export default CreateBranch