import React, { useState, useContext } from 'react'
import { PostContext } from '../contexts/PostContext'
import axios from 'axios'
import config from '../Config'

function CreatePostModal(props) {
    const context = useContext(PostContext);

    const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [titleError, setTitleError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)

    function onSubmit(e) {
        e.preventDefault();
        if (title && description !== '') {
            // let date = new Date()
            let post = { user, title, description }
            axios({ method: 'post', url: config.environmentURL, data: { post } })
                .then(res => { console.log(res) })
                .then(props.toggleModal)
                .then(setTimeout(() => {context.getPosts()}, 100))
        } else if (title === '') {
            setTitleError(true);
        } if (description === '') {
            setDescriptionError(true);
        }
    }

    return (
        <div className="modal-wrapper">
            <div className="create-post-modal">
                <span className="page-title">Create a new post</span>
                <form  className="create-post-form" onSubmit={onSubmit}> 
                    <input className="input-wrapper modal mb-20"
                        type="text"
                        placeholder="Username..."
                        name="user"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                    <input className={"input-wrapper modal mb-20 " + (titleError ? 'error' : '')}
                        type="text"
                        placeholder="Title..."
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea className={"input-wrapper modal mb-20 " + (descriptionError ? 'error' : '')}
                        style={{ height:'auto', paddingTop:10 }}
                        rows="5"
                        type="text"
                        placeholder="Description..."
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="button-container">
                        <button className="button">Post</button>
                        <div className="button" onClick={props.toggleModal}>Cancel</div>
                    </div>
                </form>
            </div>

            <style jsx="true">{`
                .modal-wrapper {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.4);
                    z-index: 1;
                    animation-name: fade-in;
                    animation-duration: 0.5s;
                }
                .create-post-modal {
                    position: absolute;
                    top: 150px;
                    left: calc(50% - 250px);
                    width: 500px;
                    //height: 600px;
                    padding: 40px;
                    background-color: white;
                    box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
                    border-radius: 5px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .create-post-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                .button-container {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .error {
                    box-shadow: 0 0 5px 5px rgba(255, 0, 0, 0.6);
                }
            `}</style>
        </div>
    )
}

export default CreatePostModal

// import React, { Component } from 'react'

// export class CreatePostModal extends Component {
//     state = {
//         newPost: {
//             title: '',
//             description: '',
//             creator: '',
//             tags: null,
//             comments: null,
//             date: null,
//             // likes: null
//         },
//         titleError: false,
//         descriptionError: false
//     }
    
//     onChange = (e) => this.setState({ newPost: { ...this.state.newPost, date: new Date(), likes: 0, [e.target.name]: e.target.value} }); // id: this.props.posts.length + 1,

//     onSubmit = (e) => {
//         e.preventDefault();
//         const {title, description} = this.state.newPost;
//         if (title && description !== '') {
//             this.props.newPost(this.state.newPost);
//             this.setState({ newPost: {title: '', description: '', creator: '', date: null} });
//             this.props.hidePostModal();
//         } else if (title === '') {
//             this.setState({ titleError: true });
//         } if (description === '') {
//             this.setState({ descriptionError: true });
//         }
//     }

//     hidePostModal = () => {
//         this.setState({ titleError: false, descriptionError: false });
//         this.props.hidePostModal()
//     }

//     render() {
//         return (
//             <div className="modal-wrapper" style={this.props.showHidePostModal}>

//                 <div className="create-post-modal">
//                     <span className="page-title">Create a new post</span>
//                     <form onSubmit={this.onSubmit} className="create-post-form">
//                         <input className="input-wrapper modal margin-bottom-20"
//                             type="text"
//                             placeholder="Username..."
//                             name="creator"
//                             value={this.state.newPost.creator}
//                             onChange={this.onChange}
//                         />
//                         <input className={"input-wrapper modal margin-bottom-20 " + (this.state.titleError ? 'error' : '')}
//                             type="text"
//                             placeholder="Post title..."
//                             name="title"
//                             value={this.state.newPost.title}
//                             onChange={this.onChange}
//                         />
//                         <textarea className={"input-wrapper modal margin-bottom-20 " + (this.state.descriptionError ? 'error' : '')}
//                             style={{height:'auto', paddingTop:10}}
//                             rows="5"
//                             type="text"
//                             placeholder="Post description..."
//                             name="description"
//                             value={this.state.newPost.description}
//                             onChange={this.onChange}
//                         />
//                         <div className="button-container">
//                             <button className="button">Post</button>
//                             <div className="button" onClick={this.hidePostModal}>Cancel</div>
//                         </div>
//                     </form>
//                 </div>

//                 <style jsx="true">{`
//                     .modal-wrapper {
//                         position: fixed;
//                         top: 0;
//                         left: 0;
//                         width: 100%;
//                         height: 100%;
//                         background-color: rgba(0,0,0,0.4);
//                         z-index: 1;
//                         animation-name: fade-in;
//                         animation-duration: 0.5s;
//                     }
//                     .create-post-modal {
//                         position: absolute;
//                         top: 150px;
//                         left: calc(50% - 250px);
//                         width: 500px;
//                         //height: 600px;
//                         padding: 40px;
//                         background-color: white;
//                         box-shadow: 0 1px 30px 0 rgba(0,0,0,0.2);
//                         border-radius: 5px;
//                         display: flex;
//                         flex-direction: column;
//                         align-items: center;
//                     }
//                     .create-post-form {
//                         display: flex;
//                         flex-direction: column;
//                         justify-content: center;
//                         align-items: center;
//                     }
//                     .button-container {
//                         display: flex;
//                         flex-direction: row;
//                         align-items: center;
//                     }
//                 `}</style>

//             </div>
//         )
//     }
// }

// export default CreatePostModal