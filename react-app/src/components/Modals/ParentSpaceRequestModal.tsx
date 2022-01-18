import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'universal-cookie'
import config from '@src/Config'
import styles from '@styles/components/Modal.module.scss'
import { AccountContext } from '@contexts/AccountContext'
import { SpaceContext } from '@contexts/SpaceContext'
import Modal from '@components/Modal'
import Button from '@components/Button'
import LoadingWheel from '@components/LoadingWheel'
import SuccessMessage from '@components/SuccessMessage'
import SearchSelector from '@components/SearchSelector'
import ImageTitle from '@components/ImageTitle'
import CloseButton from '@components/CloseButton'

const ParentSpaceRequestModal = (props: { close: () => void }): JSX.Element => {
    const { close } = props
    const { accountData } = useContext(AccountContext)
    const { spaceData, setSpaceData } = useContext(SpaceContext)
    const [blacklist, setBlacklist] = useState<string[]>([])
    const [blacklistRetrieved, setBlacklistRetrieved] = useState(false)
    const [inputState, setInputState] = useState<'default' | 'valid' | 'invalid'>('default')
    const [inputErrors, setInputErrors] = useState<string[]>([])
    const [options, setOptions] = useState<any[]>([])
    const [selectedSpace, setSelectedSpace] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const cookies = new Cookies()

    const accountIsModOfSelectedSpace =
        selectedSpace && selectedSpace.Moderators.map((m) => m.id).includes(accountData.id)

    function getParentSpaceBlacklist() {
        axios
            .get(`${config.apiURL}/parent-space-blacklist?spaceId=${spaceData.id}`)
            .then((res) => {
                setBlacklist(res.data)
                setBlacklistRetrieved(true)
            })
            .catch((error) => console.log(error))
    }

    function findSpaces(query) {
        if (query.length < 1) setOptions([])
        else if (blacklistRetrieved) {
            const accessToken = cookies.get('accessToken')
            const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
            const data = { spaceId: spaceData.id, query, blacklist }
            axios
                .post(`${config.apiURL}/viable-parent-spaces`, data, authHeader)
                .then((res) => setOptions(res.data))
                .catch((error) => console.log(error))
        }
    }

    function selectSpace(user) {
        setOptions([])
        setSelectedSpace(user)
    }

    function sendParentSpaceRequest(e) {
        e.preventDefault()
        setLoading(true)
        const accessToken = cookies.get('accessToken')
        const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } }
        if (accountIsModOfSelectedSpace) {
            // add parent space
            const data = { spaceId: spaceData.id, parentSpaceId: selectedSpace.id }
            axios
                .post(`${config.apiURL}/add-parent-space`, data, authHeader)
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
                            // remove root space if present
                            const newParentSpaces = spaceData.DirectParentHolons.filter(
                                (s) => s.id !== 1
                            )
                            // add new parent space
                            newParentSpaces.push(selectedSpace)
                            // update space context
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
        } else {
            // send parent space request
            const data = {
                accountHandle: accountData.handle,
                accountName: accountData.name,
                spaceId: spaceData.id,
                spaceName: spaceData.name,
                spaceHandle: spaceData.handle,
                parentSpaceId: selectedSpace.id,
            }
            axios
                .post(`${config.apiURL}/send-parent-space-request`, data, authHeader)
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
                        case 'success':
                            setShowSuccessMessage(true)
                            setTimeout(() => close(), 3000)
                            break
                        default:
                            break
                    }
                })
        }
    }

    useEffect(() => getParentSpaceBlacklist(), [])

    return (
        <Modal close={close} style={{ maxWidth: 600 }}>
            <h1>Add a new parent space</h1>
            <p>
                If you&apos;re a moderator of the selected space it will be connected automatically
                otherwise a request will be sent to the spaces moderators.
            </p>
            <p>
                Once added, posts to &apos;{spaceData.name}&apos; will then appear in that parent
                space and any parent spaces above it.
            </p>
            <form onSubmit={sendParentSpaceRequest}>
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
                                type='user'
                                imagePath={selectedSpace.flagImagePath}
                                title={`${selectedSpace.name} (${selectedSpace.handle})`}
                            />
                            <CloseButton size={17} onClick={() => setSelectedSpace(null)} />
                        </div>
                        {accountIsModOfSelectedSpace ? (
                            <p className='success'>You are a moderator of this space</p>
                        ) : (
                            <p className='danger'>You are not a moderator of this space</p>
                        )}
                    </div>
                )}
                <div className={styles.footer}>
                    <Button
                        text={accountIsModOfSelectedSpace ? 'Add parent space' : 'Send request'}
                        color='blue'
                        style={{ marginRight: 10 }}
                        disabled={loading || showSuccessMessage || !selectedSpace}
                        submit
                    />
                    {loading && <LoadingWheel />}
                    {showSuccessMessage && (
                        <SuccessMessage
                            text={
                                accountIsModOfSelectedSpace
                                    ? 'Parent space added!'
                                    : 'Request sent!'
                            }
                        />
                    )}
                </div>
            </form>
        </Modal>
    )
}

export default ParentSpaceRequestModal
