import React, { useState, useContext } from 'react';
import styles from '../styles/components/WallHeader.module.scss'
import WallSearchBar from './WallSearchBar';
import WallFilters from './WallFilters';
import CreatePost from './CreatePost';
import { HolonContext } from '../contexts/HolonContext'

function WallHeader() {
    const { isLoading } = useContext(HolonContext);
    const [modalOpen, setModalOpen] = useState(false);
    

    function toggleModal() {
        if (!isLoading) { setModalOpen(!modalOpen) }
    }

    return (
        <div className={styles.wallHeader}>
            <WallSearchBar/>
            <button className="button mb-10" onClick={ toggleModal }>Create Post</button>
            {modalOpen && 
                <CreatePost toggleModal={ toggleModal }/>
            }
            <WallFilters/>
        </div>
    )
}

export default WallHeader
