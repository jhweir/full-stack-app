import React from 'react'
import WallPlaceholder from '../components/WallPlaceholder'
import PostPlaceholder from '../components/PostPlaceholder'
import HolonPlaceholder from '../components/HolonPlaceholder'

export default function EmptyPage() {
    return (
        <>
            <div className="empty-page">
                <div>Sorry, this page does not exist... :_(</div>
                <div className="test-space">
                    {/* <WallPlaceholder /> */}
                    <PostPlaceholder/>
                    <PostPlaceholder/>
                    <HolonPlaceholder/>

                </div>
            </div>

            <style jsx="true">{`
                .empty-page {
                    padding: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .test-space {
                    margin-top: 50px;
                }
            `}</style>
        </>
    )
}
