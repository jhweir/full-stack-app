import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/DeleteCommentModal.module.scss'
import CloseButton from '../CloseButton'

function DeleteItemModal(props) {
    const { text, endpoint, itemId, totalItems, setTotalItems, setDeleteItemModalOpen, getItems1, getItems2 } = props

    function deleteItem() {
        console.log('itemId: ', itemId)
        axios
            .delete(config.apiURL  + `/${endpoint}`, { data: { itemId } })
            .then(res => {
                if (res.data === 'success') {
                    setDeleteItemModalOpen(false)
                    if (setTotalItems !== undefined) {
                        setTotalItems(totalItems - 1)
                    }
                    setTimeout(() => {
                        if (getItems1 !== undefined) {
                            getItems1()
                        }
                        if (getItems2 !== undefined) {
                            getItems2()
                        }
                    }, 300)
                }
            })
            .catch(error => { console.log(error) })
    }

    const ref = useRef()
    function handleClickOutside(e) { 
        if (!ref.current.contains(e.target)) { setDeleteItemModalOpen(false) } 
    }
    useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    })

    return (
        <div className={styles.modalWrapper}>
            <div className={styles.modal} ref={ref}>
                <CloseButton onClick={() => setDeleteItemModalOpen(false)}/>
                <span className={styles.text}>{ text }</span>
                <div
                    className="wecoButton"
                    onClick={deleteItem}>
                    Yes
                </div>
            </div>
        </div>
    )
}

export default DeleteItemModal
