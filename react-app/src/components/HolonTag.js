import React from 'react'

function BranchTag(props) {
    const { holonTag, added, addSuggestedHolonTag, removeHolonTag } = props
    return (
        <>
            {/* Suggested holonTags */}
            {!added && <div className="suggested-holon-tag" onClick={() => addSuggestedHolonTag(holonTag)}>
                <div className="tag-text mr-10">{ holonTag.handle }</div>
            </div>}

            {/* Added holonTags */}
            {added && <div className="added-holon-tag">
                <div className="tag-text mr-10">{ holonTag.handle }</div>
                <div className="close-icon" onClick={() => removeHolonTag(holonTag)}></div>
            </div>}

            <style jsx="true">{`
                .suggested-holon-tag {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #ddd;
                    border-radius: 5px;
                    padding: 10px 10px 10px 15px;
                    margin: 0 10px 10px 0;
                }
                .suggested-holon-tag:hover {
                    cursor: pointer;
                }
                .added-holon-tag {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #ddd;
                    border-radius: 5px;
                    padding: 10px 10px 10px 15px;
                    margin: 0 10px 10px 0;
                }
                .tag-text {
                    margin
                }
                .close-icon {
                    background-image: url(/icons/close-01.svg);
                    background-position: center;
                    background-repeat: no-repeat;
                    background-size: cover;
                    background-color: transparent;
                    border: none;
                    height: 17px;
                    width: 17px;
                    padding: 0;
                    opacity: 0.4;
                    margin-right: 5px;
                }
                .close-icon:hover {
                    cursor: pointer;
                }
            `}</style>
        </>
    )
}

export default BranchTag