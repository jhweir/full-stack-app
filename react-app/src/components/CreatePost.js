import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import axios from 'axios'
import config from '../Config'
import HolonTagInput from './HolonTagInput'

function CreatePost(props) {
    const { holonData, globalData, getHolonContent, isLoading } = useContext(HolonContext);
    const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [holonTags, setHolons] = useState([])
    const [newHolonTag, setNewHolonTag] = useState('')
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [holonError, setHolonError] = useState(false)
    const [holonErrorMessage, setHolonErrorMessage] = useState(false)

    // Add the holonTag the user is in to the holonTag list when the data has loaded
    useEffect(() => {
        setHolons([...holonTags, holonData])
    }, [isLoading])

    function addHolonTag(e) {
        e.preventDefault()
        const validHolonTag = globalData.filter(holonTag => (holonTag.handle === newHolonTag))
        if (newHolonTag === '') {
            setHolonError(true)
        } else if (validHolonTag.length === 0) {
            setHolonError(true)
            setHolonErrorMessage(true)
        } else if (validHolonTag.length && !holonTags.includes(validHolonTag[0]) ) {
            setHolons([...holonTags, validHolonTag[0]])
            setNewHolonTag('')
        }
    }

    function addSuggestedHolonTag(holonTag) {
        setHolons([...holonTags, holonTag])
    }

    function removeHolonTag(holonTag) {
        const updatedHolonTags = holonTags.filter((holonTags) => {
            return holonTags !== holonTag
        })
        setHolons(updatedHolonTags)
    }

    function submitPost(e) {
        e.preventDefault()
        if (title === '') { setTitleError(true) }
        if (description === '') { setDescriptionError(true) }
        if (title && description !== '') {
            let post = { title, description, holonTags }
            axios({ method: 'post', url: config.environmentURL + `/createPost`, data: { post } })
                .then(res => { console.log(res) })
                .then(props.toggleModal)
                // .then(setTimeout(() => { getBranchContent() }, 100))
        }
    }

    return (
        <>
            <div className="modal-wrapper">
                <div className="create-post-modal hide-scrollbars">
                    <form className="create-post-modal-form" onSubmit={ submitPost }>
                        <div className="create-post-modal-title">Create a new post in { holonData.name }</div>
                        <div className="create-post-modal-sub-title">Chose a post type:</div>
                        <div className="create-post-modal-type-selector">
                            <div className="create-post-modal-type-selector-button">Text</div>
                            <div className="create-post-modal-type-selector-button">Video</div>
                            <div className="create-post-modal-type-selector-button">Audio</div>
                            <div className="create-post-modal-type-selector-button">Poll</div>
                        </div>
                        <div className="create-post-modal-form-top">
                            <div className="create-post-modal-form-top-left">
                                {/* <input className="input-wrapper modal mb-20"
                                    type="text"
                                    placeholder="Username..."
                                    value={ user }
                                    onChange={(e) => setUser(e.target.value)}
                                /> */}
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
                            </div>
                            <div className="create-post-modal-form-top-right">
                                <HolonTagInput 
                                    globalData={globalData}
                                    addHolonTag={addHolonTag}
                                    removeHolonTag={removeHolonTag}
                                    holonTags={holonTags}
                                    newHolonTag={newHolonTag}
                                    setNewHolonTag={setNewHolonTag}
                                    holonError={holonError}
                                    setHolonError={setHolonError}
                                    holonErrorMessage={holonErrorMessage}
                                    setHolonErrorMessage={setHolonErrorMessage}
                                    addSuggestedHolonTag={addSuggestedHolonTag}
                                />
                            </div>
                        </div>
                        <div className="create-post-modal-form-bottom">
                            <div className="button-container">
                                <button className="button">Post</button>
                                <div className="button" onClick={ props.toggleModal }>Cancel</div>
                            </div>
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
                    background-color: rgba(0,0,0,0.3);
                    backdrop-filter: blur(30px);
                    z-index: 5;
                    animation-name: fade-in;
                    animation-duration: 0.5s;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .create-post-modal {
                    width: 1000px;
                    padding: 40px;
                    background-color: white;
                    box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
                    border-radius: 10px;
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
                .create-post-modal-form {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    //align-items: center;
                }
                .create-post-modal-title {
                    font-size: 30px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .create-post-modal-sub-title {
                    font-size: 20px;
                    margin-bottom: 20px;
                    text-align: center;
                }
                .create-post-modal-type-selector {
                    width: 100%;
                    height: 80px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    //align-items: center;
                }
                .create-post-modal-type-selector-button {
                    width: 150px;
                    height: 50px;
                    border-radius: 10px;
                    background-color: #3a88f0;
                    margin-right: 10px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }
                .create-post-modal-form-top {
                    display: flex;
                    flex-direction: row;
                    //justify-content: space-between;
                    //align-items: center;
                }
                .create-post-modal-form-top-left {
                    margin: 0 20px;
                    display: flex;
                    flex-direction: column;
                    //justify-content: space-between;
                    //align-items: center;
                }
                .create-post-modal-form-top-right {
                    margin: 0 20px;
                    display: flex;
                    //flex-direction: row;
                    //justify-content: space-between;
                    //align-items: center;
                }
                .create-post-modal-form-bottom {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    //align-items: center;
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