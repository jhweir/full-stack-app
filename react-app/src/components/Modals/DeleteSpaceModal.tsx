import React, { useContext, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import styles from '@styles/components/Modal.module.scss'
import { SpaceContext } from '@contexts/SpaceContext'
import Modal from '@components/Modal'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'

const DeleteSpaceModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData } = useContext(SpaceContext)
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()
    const history = useHistory()

    function deleteSpace(e) {
        e.preventDefault()
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        const data = { spaceId: spaceData.id }
        axios
            .post(`${config.apiURL}/delete-space`, data, authHeader)
            .then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        // setInputState('invalid')
                        // setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'unauthorized':
                        // setInputState('invalid')
                        // setInputErrors([
                        //     `Unauthorized. You must be a moderator of ${spaceData.name} to complete this action.`,
                        // ])
                        break
                    case 'success': {
                        // todo: remove deleted space from followed/moderted spaces in account
                        setShowSuccessMessage(true)
                        setTimeout(() => history.push(`/s/all`), 3000)
                        break
                    }
                    default:
                        break
                }
            })
            .catch((error) => console.log(error))
    }

    return (
        <Modal close={close} maxWidth={600}>
            <h1>Delete &apos;{spaceData.name}&apos;</h1>
            <p>Are you sure you want to permanently delete &apos;{spaceData.name}&apos;?</p>
            <p>
                All contained child-spaces with no other parents will be re-attached to the root
                space <Link to='/s/all/spaces'>all</Link>.
            </p>
            <form onSubmit={deleteSpace}>
                <div className={styles.footer}>
                    <Button
                        submit
                        text='Delete space'
                        colour='red'
                        size='medium'
                        margin='0 10px 0 0'
                        disabled={loading}
                    />
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='Space deleted' />}
                </div>
            </form>
        </Modal>
    )
}

export default DeleteSpaceModal
