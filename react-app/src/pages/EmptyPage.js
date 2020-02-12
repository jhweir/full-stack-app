import React from 'react'

export default function EmptyPage() {
    return (
        <>
            <div className="empty-page ">
                Sorry, this page does not exist... :_(
            </div>

            <style jsx="true">{`
                .empty-page {
                    padding: 40px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
            `}</style>
        </>
    )
}
