import React, { useContext, useEffect } from 'react'
import { MyContext } from '../components/MyContext'
import Post from '../components/Post'



export default function ChildThree() {
    const context = useContext(MyContext);
    useEffect(() => {
        context.updateContext()
    }, [])
    return (
        <div>
            <p>Child Three: {context.test}</p>
            <button onClick={() => context.updateContext()}>Update context</button>
            <div>{context.posts.map((post, index) => ( 
                <Post key={index} index={index} post={post} /> ))} 
            </div>
        </div>
    )
}

// function Post() {
//     return(
//         <div>
//             Post title: {post.title}
//         </div>
//     )
// }

// import React, { Component } from 'react'
// import { MyContext } from '../components/MyContext'

// export class ChildThree extends Component {
//     static contextType = MyContext

//     render() {
//         return (
//             <div>
                
//             </div>
//         )
//     }
// }

// export default ChildThree