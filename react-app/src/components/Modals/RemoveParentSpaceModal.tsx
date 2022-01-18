import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
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

const RemoveParentSpaceModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { spaceData, setSpaceData } = useContext(SpaceContext)
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [options, setOptions] = useState<any[]>([])
    const [selectedSpace, setSelectedSpace] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()

    const onlyOneParent = spaceData.DirectParentHolons.length === 1
    const onlyParentIsRoot = onlyOneParent && spaceData.DirectParentHolons[0].id === 1

    function findSpaces(query) {
        if (query.length < 1) setOptions([])
        else {
            const filteredSpaces = spaceData.DirectParentHolons.filter(
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

    function removeParentSpace(e) {
        e.preventDefault()
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        const data = {
            childSpaceId: spaceData.id,
            parentSpaceId: selectedSpace.id,
            fromChild: true,
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
                        const newParentSpaces = spaceData.DirectParentHolons.filter(
                            (s) => s.id !== selectedSpace.id
                        )
                        setSpaceData({
                            ...spaceData,
                            DirectParentHolons: newParentSpaces,
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
            <h1>Remove a parent space</h1>
            {onlyParentIsRoot ? (
                <>
                    <p>
                        The only parent you&apos;re connected to at the moment is the root space. To
                        disconnect from there you need to attach to another parent first, otherwise
                        your space won&apos;t appear anywhere on the site.
                    </p>
                    <Button onClick={close} text='OK' color='blue' />
                </>
            ) : (
                <>
                    {onlyOneParent && (
                        <p>
                            &apos;{spaceData.name}&apos; only has one parent so it will be
                            re-attached to the root space <Link to='/s/all/spaces'>all</Link> if you
                            remove it.
                        </p>
                    )}
                    <p>
                        Once removed, new posts to &apos;{spaceData.name}&apos; will no longer
                        appear in the removed parent space. (Old posts will remain where they were
                        when posted)
                    </p>
                    <form onSubmit={removeParentSpace}>
                        <SearchSelector
                            type='space'
                            title="Search for the parent space's name or handle below:"
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
                                text='Remove parent space'
                                color='blue'
                                style={{ marginRight: 10 }}
                                disabled={loading || showSuccessMessage || !selectedSpace}
                            />
                            {loading && <LoadingWheel />}
                            {showSuccessMessage && <SuccessMessage text='Parent space removed' />}
                        </div>
                    </form>
                </>
            )}
        </Modal>
    )
}

export default RemoveParentSpaceModal
