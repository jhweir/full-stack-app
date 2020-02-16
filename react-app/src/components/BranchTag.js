import React from 'react'

function BranchTag(props) {
    const { branch, added, addSuggestedBranch, removeBranch } = props
    return (
        <>
            {/* Suggested branches */}
            {!added && <div className="suggested-branch-tag" onClick={() => addSuggestedBranch(branch)}>
                <div className="tag-text mr-10">{ branch.name }</div>
            </div>}

            {/* Added branches */}
            {added && <div className="added-branch-tag">
                <div className="tag-text mr-10">{ branch.name }</div>
                <div className="close-icon" onClick={() => removeBranch(branch)}></div>
            </div>}

            <style jsx="true">{`
                .suggested-branch-tag {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    background-color: #ddd;
                    border-radius: 5px;
                    padding: 10px 10px 10px 15px;
                    margin: 0 10px 10px 0;
                }
                .suggested-branch-tag:hover {
                    cursor: pointer;
                }
                .added-branch-tag {
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
