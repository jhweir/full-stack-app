import React from 'react'
import axios from 'axios'
import config from '../../Config'
import styles from '../../styles/components/DeleteCommentModal.module.scss'
import CloseButton from '../CloseButton'
import CloseOnClickOutside from '../CloseOnClickOutside'

const DeleteItemModal = (props: {
    text: string
    endpoint: string
    itemId: number | undefined
    totalItems?: number
    setTotalItems?: (payload: number) => void
    setDeleteItemModalOpen: (payload: boolean) => void
    getItems1: () => any
    getItems2?: () => any
}): JSX.Element => {
    const {
        text,
        endpoint,
        itemId,
        totalItems,
        setTotalItems,
        setDeleteItemModalOpen,
        getItems1,
        getItems2,
    } = props

    function deleteItem() {
        console.log('itemId: ', itemId)
        axios
            .delete(`${config.apiURL}/${endpoint}`, { data: { itemId } })
            .then((res) => {
                if (res.data === 'success') {
                    setDeleteItemModalOpen(false)
                    if (totalItems && setTotalItems) {
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
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div className={styles.modalWrapper}>
            <CloseOnClickOutside onClick={() => setDeleteItemModalOpen(false)}>
                <div className={styles.modal}>
                    <CloseButton onClick={() => setDeleteItemModalOpen(false)} />
                    <span className={styles.text}>{text}</span>
                    <div
                        className='wecoButton'
                        role='button'
                        tabIndex={0}
                        onClick={deleteItem}
                        onKeyDown={deleteItem}
                    >
                        Yes
                    </div>
                </div>
            </CloseOnClickOutside>
        </div>
    )
}

DeleteItemModal.defaultProps = {
    getItems2: null,
    totalItems: 0,
    setTotalItems: null,
}

export default DeleteItemModal
