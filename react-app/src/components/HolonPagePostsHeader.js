import React, { useState, useContext } from 'react';
import styles from '../styles/components/HolonPagePostsHeader.module.scss'
import HolonPagePostsSearchBar from './HolonPagePostsSearchBar';
import HolonPagePostsFilters from './HolonPagePostsFilters';
import CreatePost from './CreatePost';
import { HolonContext } from '../contexts/HolonContext'

function HolonPagePostsHeader() {
    const { holonContextLoading } = useContext(HolonContext);
    const [modalOpen, setModalOpen] = useState(false);
    

    function toggleModal() {
        if (!holonContextLoading) { setModalOpen(!modalOpen) }
    }

    return (
        <div className={styles.wallHeader}>
            <HolonPagePostsSearchBar/>
            <button className="button mb-10" onClick={ toggleModal }>Create Post</button>
            {modalOpen && <CreatePost toggleModal={ toggleModal }/>}
            <HolonPagePostsFilters/>
        </div>
    )
}

export default HolonPagePostsHeader
