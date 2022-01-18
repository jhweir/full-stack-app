import React, { useContext, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import styles from '@styles/components/Modal.module.scss'
import { SpaceContext } from '@contexts/SpaceContext'
import Modal from '@components/Modal'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'
import SearchSelector from '@components/SearchSelector'
import ImageTitle from '@components/ImageTitle'
import CloseButton from '@components/CloseButton'

const RemoveChildSpaceModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData, setSpaceData } = useContext(SpaceContext)
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [options, setOptions] = useState<any[]>([])
    const [selectedSpace, setSelectedSpace] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()

    function findSpaces(query) {
        if (query.length < 1) setOptions([])
        else {
            const filteredSpaces = spaceData.DirectChildHolons.filter(
                (space) =>
                    space.handle.includes(query.toLowerCase()) ||
                    space.name.toLowerCase().includes(query.toLowerCase())
            )
            setOptions(filteredSpaces)
        }
    }

    function selectSpace(user) {
        setOptions([])
        setSelectedSpace(user)
    }

    function removeChildSpace(e) {
        e.preventDefault()
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        const data = {
            childSpaceId: selectedSpace.id,
            parentSpaceId: spaceData.id,
            fromChild: false,
        }
        axios
            .post(`${config.apiURL}/remove-parent-space`, data, authHeader)
            .then((res) => {
                setLoading(false)
                switch (res.data) {
                    case 'invalid-auth-token':
                        setInputState('invalid')
                        setInputErrors(['Invalid auth token. Try logging in again.'])
                        break
                    case 'unauthorized':
                        setInputState('invalid')
                        setInputErrors([
                            `Unauthorized. You must be a moderator of ${spaceData.name} to complete this action.`,
                        ])
                        break
                    case 'success': {
                        const newChildSpaces = spaceData.DirectChildHolons.filter(
                            (s) => s.id !== selectedSpace.id
                        )
                        setSpaceData({
                            ...spaceData,
                            DirectChildHolons: newChildSpaces,
                        })
                        setShowSuccessMessage(true)
                        setTimeout(() => close(), 3000)
                        break
                    }
                    default:
                        break
                }
            })
            .catch((error) => console.log(error))
    }

    return (
        <Modal close={close} style={{ maxWidth: 600 }}>
            <h1>Remove a child space from &apos;{spaceData.name}&apos;</h1>
            <p>
                Once removed, new posts to the removed child space will no longer appear in &apos;
                {spaceData.name}&apos;. (Old posts will remain where they were when posted)
            </p>
            <form onSubmit={removeChildSpace}>
                <SearchSelector
                    type='space'
                    title="Search for the child space's name or handle below:"
                    placeholder='name or handle...'
                    state={inputState}
                    errors={inputErrors}
                    onSearchQuery={(query) => findSpaces(query)}
                    onOptionSelected={(space) => selectSpace(space)}
                    options={options}
                />
                {selectedSpace && (
                    <div className={styles.selectedOptionWrapper}>
                        <p>Selected space:</p>
                        <div className={styles.selectedOption}>
                            <ImageTitle
                                type='space'
                                imagePath={selectedSpace.flagImagePath}
                                title={`${selectedSpace.name} (${selectedSpace.handle})`}
                            />
                            <CloseButton size={17} onClick={() => setSelectedSpace(null)} />
                        </div>
                    </div>
                )}
                <div className={styles.footer}>
                    <Button
                        submit
                        text='Remove child space'
                        color='blue'
                        style={{ marginRight: 10 }}
                        disabled={loading || showSuccessMessage || !selectedSpace}
                    />
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && <SuccessMessage text='Child space removed' />}
                </div>
            </form>
        </Modal>
    )
}

export default RemoveChildSpaceModal
