import React, { useContext } from 'react'
import { AccountContext } from '@contexts/AccountContext'
import Modal from '@components/Modal'
import Button from '@components/Button'

const AlertModal = (): JSX.Element => {
    const { setAlertModalOpen, alertMessage, setLogInModalOpen } = useContext(AccountContext)

    const logIn = () => {
        setLogInModalOpen(true)
        setAlertModalOpen(false)
    }

    return (
        <Modal close={() => setAlertModalOpen(false)} centered>
            <h1>{alertMessage}</h1>
            {alertMessage.includes('Log in') ? (
                <Button text='Log in' colour='blue' onClick={() => logIn()} />
            ) : (
                <Button text='Ok' colour='blue' onClick={() => setAlertModalOpen(false)} />
            )}
        </Modal>
    )
}

export default AlertModal
