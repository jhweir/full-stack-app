import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import styles from '@styles/components/Modal.module.scss'
import Modal from '@components/Modal'
import Input from '@components/Input'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'

const CreateSpaceModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { accountData } = useContext(AccountContext)
    const { isModerator, spaceData, setSpaceData, spaceSpaces, setSpaceSpaces } = useContext(
        SpaceContext
    )

    type InputState = 'default' | 'valid' | 'invalid'

    const [name, setName] = useState('')
    const [nameState, setNameState] = useState<InputState>('default')
    const [nameErrors, setNameErrors] = useState<string[]>([])

    const [handle, setHandle] = useState('')
    const [handleState, setHandleState] = useState<InputState>('default')
    const [handleErrors, setHandleErrors] = useState<string[]>([])

    const [description, setDescription] = useState('')
    const [descriptionState, setDescriptionState] = useState<InputState>('default')
    const [descriptionErrors, setDescriptionErrors] = useState<string[]>([])

    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const errors =
        nameState === 'invalid' || handleState === 'invalid' || descriptionState === 'invalid'

    const cookies = new Cookies()
    const authorizedToAttachParent = isModerator || spaceData.id === 1

    function createSpace(e) {
        e.preventDefault()
        const invalidHandle = handle.length < 1 || handle.length > 30
        const invalidName = name.length < 1 || name.length > 30
        const invalidDescription = description.length < 1 || description.length > 10000
        setHandleState(invalidHandle ? 'invalid' : 'valid')
        setHandleErrors(invalidHandle ? ['Must be between 1 and 30 characters.'] : [])
        setNameState(invalidName ? 'invalid' : 'valid')
        setNameErrors(invalidName ? ['Must be between 1 and 30 characters.'] : [])
        setDescriptionState(invalidDescription ? 'invalid' : 'valid')
        setDescriptionErrors(invalidDescription ? ['Must be between 1 and 10K characters.'] : [])
        if (!invalidHandle && !invalidName && !invalidDescription) {
            setLoading(true)
            const data = {
                accountName: accountData.name,
                accountHandle: accountData.handle,
                parentId: spaceData.id,
                authorizedToAttachParent,
                handle,
                name,
                description,
            }
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            axios.post(`${config.apiURL}/create-space`, data, authHeader).then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        // setInputState('invalid')
                        // setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'handle-taken':
                        setHandleState('invalid')
                        setHandleErrors(['Handle already taken'])
                        break
                    case 'success': {
                        setSuccessMessage(`Space created and attached to '${spaceData.name}'`)
                        // update space context
                        const newSpaceData = {
                            id: null,
                            handle,
                            name,
                            description,
                            flagImagePath: null,
                            coverImagePath: null,
                            createdAt: new Date(),
                            total_followers: 0,
                            total_comments: 0,
                            total_reactions: 0,
                            total_likes: 0,
                            total_ratings: 0,
                            total_posts: 0,
                            total_children: 0,
                        }
                        const newDirectChildSpaces = [newSpaceData, ...spaceData.DirectChildHolons]
                        setSpaceData({ ...spaceData, DirectChildHolons: newDirectChildSpaces })
                        const newSpaceSpaces = [newSpaceData, ...spaceSpaces]
                        setSpaceSpaces(newSpaceSpaces)
                        setTimeout(() => close(), 3000)
                        break
                    }
                    case 'pending-acceptance':
                        setSuccessMessage('Space created and request sent to moderators')
                        setTimeout(() => close(), 3000)
                        break
                    default:
                        break
                }
            })
        }
    }

    return (
        <Modal close={close} style={{ maxWidth: 600 }}>
            <h1>Create a new space in &apos;{spaceData.name}&apos;</h1>
            {!authorizedToAttachParent && (
                <>
                    <p>You&apos;re not authorised to create a space here automatically.</p>
                    <p>
                        If you want you can create it anyway and a request will be sent to{' '}
                        {spaceData.name}&apos;s moderators.
                    </p>
                    <p>
                        Until it&apos;s accepted by them your space will appear in the root space{' '}
                        <Link to='/s/all/spaces'>all</Link>.
                    </p>
                </>
            )}
            <p>You will be the default moderator of the space and have access to its settings.</p>
            <form onSubmit={createSpace}>
                <Input
                    type='text'
                    title='Handle (the unique identifier used in the spaces url):'
                    prefix='weco.io/s/'
                    placeholder='handle...'
                    style={{ marginBottom: 20 }}
                    state={handleState}
                    errors={handleErrors}
                    value={handle}
                    onChange={(newValue) => {
                        setHandleState('default')
                        setHandle(newValue.toLowerCase().replace(/[^a-z0-9]/g, '-'))
                    }}
                />
                <Input
                    type='text'
                    title='Name (max 30 characters):'
                    placeholder='name...'
                    style={{ marginBottom: 20 }}
                    state={nameState}
                    errors={nameErrors}
                    value={name}
                    onChange={(newValue) => {
                        setNameState('default')
                        setName(newValue)
                    }}
                />
                <Input
                    type='text-area'
                    title='Description (max 10K characters):'
                    placeholder='description...'
                    style={{ marginBottom: 20 }}
                    state={descriptionState}
                    errors={descriptionErrors}
                    value={description}
                    onChange={(newValue) => {
                        setDescriptionState('default')
                        setDescription(newValue)
                    }}
                />
                <div className={styles.footer}>
                    <Button
                        text={
                            authorizedToAttachParent
                                ? 'Create space'
                                : 'Create space and send request'
                        }
                        colour='blue'
                        style={{ marginRight: 10 }}
                        disabled={loading || successMessage.length > 0 || errors}
                        submit
                    />
                    {loading && <LoadingWheel />}
                    {successMessage.length > 0 && <SuccessMessage text={successMessage} />}
                </div>
            </form>
        </Modal>
    )
}

export default CreateSpaceModal
