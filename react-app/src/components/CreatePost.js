import React, { useState, useContext } from 'react'
import { PostContext } from '../contexts/PostContext'
import axios from 'axios'
import config from '../Config'
import BranchTagInput from './BranchTagInput'

function CreatePost(props) {
    const { allBranchNames, getAllPosts } = useContext(PostContext);
    const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [newBranch, setNewBranch] = useState('')
    const [branches, setBranches] = useState([])
    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const [branchError, setBranchError] = useState(false)
    const [branchErrorMessage, setBranchErrorMessage] = useState(false)

    function addBranch(e) {
        e.preventDefault()
        // Check new branch exists
        const validBranch = allBranchNames.filter(branch => (branch.name === newBranch))
        // If branch exists and is not already selected, add the new branch
        if (validBranch.length !== 0 && !branches.includes(validBranch[0]) ) {
            setBranches([...branches, validBranch[0]])
            setNewBranch('')
        // If the branch name is empty, display error styling around input box
        } else if (newBranch === '') {
            setBranchError(true)
        // If the branch doesn't exist, display error message and styling around input box
        } else if (validBranch.length === 0) {
            setBranchError(true)
            setBranchErrorMessage(true)
        }
    }

    function addSuggestedBranch(branch) {
        setBranches([...branches, branch])
    }

    function removeBranch(branch) {
        const updatedBranches = branches.filter((branches) => {
            return branches !== branch
        })
        setBranches(updatedBranches)
    }

    function submitPost(e) {
        e.preventDefault()
        if (title && description !== '') {
            let post = { user, title, description, branches }
            axios({ method: 'post', url: config.environmentURL, data: { post } })
                .then(res => { console.log(res) })
                .then(props.toggleModal)
                .then(setTimeout(() => { getAllPosts() }, 100))
        } else if (title === '') {
            setTitleError(true);
        } if (description === '') {
            setDescriptionError(true);
        }
    }

    return (
        <>
            <div className="modal-wrapper">
                <div className="create-post-modal">
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
                            addBranch={addBranch}
                            removeBranch={removeBranch}
                            branches={branches}
                            newBranch={newBranch}
                            setNewBranch={setNewBranch}
                            branchError={branchError}
                            setBranchError={setBranchError}
                            branchErrorMessage={branchErrorMessage}
                            setBranchErrorMessage={setBranchErrorMessage}
                            allBranchNames={allBranchNames}
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
                    //height: 600px;
                    padding: 40px;
                    background-color: white;
                    box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
                    border-radius: 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .create-post-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
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