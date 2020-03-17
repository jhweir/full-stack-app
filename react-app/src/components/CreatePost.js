import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import axios from 'axios'
import config from '../Config'
import BranchTagInput from './HolonTagInput'

function CreatePost(props) {
    const { holonData, globalData, getHolonContent, isLoading } = useContext(HolonContext);
    const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [holons, setHolons] = useState([])
    const [newHolon, setNewHolon] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [holonError, setHolonError] = useState(false)
    const [holonErrorMessage, setHolonErrorMessage] = useState(false)

    // Add the holon the user is in to the holon list when the data has loaded
    useEffect(() => {
        setHolons([...holons, holonData])
    }, [isLoading])

    function addBranch(e) {
        e.preventDefault()
        const validBranch = globalData.filter(holon => (holon.name === newHolon))
        if (newHolon === '') {
            setHolonError(true)
        } else if (validBranch.length === 0) {
            setHolonError(true)
            setHolonErrorMessage(true)
        } else if (validBranch.length && !holons.includes(validBranch[0]) ) {
            setHolons([...holons, validBranch[0]])
            setNewHolon('')
        }
    }

    function addSuggestedBranch(holon) {
        setHolons([...holons, holon])
    }

    function removeBranch(holon) {
        const updatedBranches = holons.filter((holons) => {
            return holons !== holon
        })
        setHolons(updatedBranches)
    }

    function submitPost(e) {
        e.preventDefault()
        if (title === '') { setTitleError(true) }
        if (description === '') { setDescriptionError(true) }
        if (title && description !== '') {
            let post = { user, title, description, holons }
            axios({ method: 'post', url: config.environmentURL, data: { post } })
                .then(res => { console.log(res) })
                .then(props.toggleModal)
                // .then(setTimeout(() => { getBranchContent() }, 100))
        }
    }

    return (
        <>
            <div className="modal-wrapper">
                <div className="create-post-modal hide-scrollbars">
                    <span className="page-title">Create a new post</span>
                    <form className="create-post-form" onSubmit={ submitPost }> 
                        <input className="input-wrapper modal mb-20"
                            type="text"
                            placeholder="Username..."
                            value={ user }
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input className={"input-wrapper modal mb-20 " + (titleError && 'error')}
                            type="text"
                            placeholder="Title..."
                            value={ title }
                            onChange={(e) => {
                                setTitle(e.target.value)
                                setTitleError(false)
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
                        <BranchTagInput 
                            globalData={globalData}
                            addBranch={addBranch}
                            removeBranch={removeBranch}
                            holons={holons}
                            newHolon={newHolon}
                            setNewHolon={setNewHolon}
                            holonError={holonError}
                            setHolonError={setHolonError}
                            holonErrorMessage={holonErrorMessage}
                            setHolonErrorMessage={setHolonErrorMessage}
                            addSuggestedBranch={addSuggestedBranch}
                        />
                        <div className="button-container">
                            <button className="button">Post</button>
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
                .create-post-modal {
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
                .create-post-form {
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

export default CreatePost