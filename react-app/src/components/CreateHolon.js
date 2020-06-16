import React, { useContext, useState, useEffect } from 'react'
import { HolonContext } from '../contexts/HolonContext'
import axios from 'axios'
import config from '../Config'
import styles from '../styles/components/CreateHolon.module.scss'
// import HolonHandleInput from './HolonHandleInput'

function CreateHolon(props) {
    const { holonData } = useContext(HolonContext);
    // const [user, setUser] = useState('')
    const [name, setName] = useState('')
    const [handle, setHandle] = useState('')
    const [description, setDescription] = useState('')
    const [nameError, setNameError] = useState(false)
    const [handleError, setHandleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)

    function publishHolon(e) {
        e.preventDefault()
        if (name === '') { setNameError(true) }
        if (handle === '') { setHandleError(true) }
        if (description === '') { setDescriptionError(true) }
        if (name && handle && description !== '') {
            let parentHolonId = holonData.id
            const holon = { name, handle, description, parentHolonId }
            axios({ method: 'post', url: config.environmentURL + `/create-holon`, data: { holon } })
                .then(props.toggleModal())
                //.then(setTimeout(() => { getData() }, 200))
        }
    }

    return (
        <div className={styles.createHolonModalWrapper}>
            <div className={styles.createHolonModal}>
                <span className={styles.createHolonTitle}>Create a new space in '{ holonData.name }'</span>
                <form className={styles.createHolonForm} onSubmit={ publishHolon }>

                    <input className={`${styles.createHolonFormInput} ${(handleError && styles.error)}`}
                        type="text" placeholder="Unique handle..." value={ handle }
                        onChange={(e) => { setHandle(e.target.value); setHandleError(false) }}/>

                    <input className={`${styles.createHolonFormInput} ${(nameError && styles.error)}`}
                        type="text" placeholder="Holon name..." value={ name }
                        onChange={(e) => { setName(e.target.value); setNameError(false) }}/>

                    <textarea className={`${styles.createHolonFormInput} ${(descriptionError && styles.error)}`}
                        style={{ height:'auto', paddingTop:10 }}
                        rows="5" type="text" placeholder="Description..." value={ description }
                        onChange={(e) => { setDescription(e.target.value); setDescriptionError(false) }}/>

                    <div className={styles.createHolonFormInputButtons}>
                        <button className="button">Create Holon</button>
                        <div className="button" onClick={ props.toggleModal }>Cancel</div>
                    </div>

                </form>
                
            </div>
        </div>
    )
}

export default CreateHolon

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