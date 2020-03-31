import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import axios from 'axios'
import config from '../Config'
import HolonHandleInput from './HolonTagInput'

function CreateHolon(props) {
    const { holonData, reRender, globalData, getChildHolons, getData, isLoading } = useContext(HolonContext);
    // const [user, setUser] = useState('')
    const [name, setName] = useState('')
    const [handle, setHandle] = useState('')
    const [description, setDescription] = useState('')
    // const [parentHolonId, setParentHolonId] = useState('')
    const [nameError, setNameError] = useState(false)
    const [handleError, setHandleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    // const [parentHolonIdError, setParentHolonIdError] = useState('')

    function publishHolon(e) {
        e.preventDefault()
        if (name === '') { setNameError(true) }
        if (handle === '') { setHandleError(true) }
        if (description === '') { setDescriptionError(true) }
        if (name && handle && description !== '') {
            //const branchTags = holonData.Tags
            let parentHolonId = holonData.id
            const holon = { name, handle, description, parentHolonId }
            axios({ method: 'post', url: config.environmentURL + `/createHolon`, data: { holon } })
                // .then(res => { console.log(res) })
                .then(props.toggleModal())
                //.then(setTimeout(() => { getData() }, 200))
        }
        //reRender()
    }

    return (
        <>
            <div className="modal-wrapper">
                <div className="create-holon-modal hide-scrollbars">
                    <span className="modal-title-large mb-20">Create a new holon in '{ holonData.name }'</span>
                    <form className="create-holon-form" onSubmit={ publishHolon }>
                        <input className={"input-wrapper modal mb-20 " + (handleError && 'error')}
                            type="text"
                            placeholder="Unique handle..."
                            value={ handle }
                            onChange={(e) => {
                                setHandle(e.target.value)
                                setHandleError(false)
                            }}
                        />
                        <input className={"input-wrapper modal mb-20 " + (nameError && 'error')}
                            type="text"
                            placeholder="Holon name..."
                            value={ name }
                            onChange={(e) => {
                                setName(e.target.value)
                                setNameError(false)
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
                        {/* <span className="modal-title-medium mb-20">Choose its location (parent holons)</span>
                        <textarea className={"input-wrapper modal mb-20 " + (parentHolonIdError && 'error')}
                            style={{ height:'auto', paddingTop:10 }}
                            rows="5"
                            type="text"
                            placeholder="Parent holon ID..."
                            value={ parentHolonId }
                            onChange={(e) => {
                                setParentHolonId(e.target.value)
                                setParentHolonIdError(false)
                            }}
                        /> */}
                        <div className="button-container">
                            <button className="button">Create Holon</button>
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
                .create-holon-modal {
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
                .create-holon-form {
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

export default CreateHolon