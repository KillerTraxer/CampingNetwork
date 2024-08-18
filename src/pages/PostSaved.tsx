import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useEffect, useState } from "react";
import useUserStore from "../features/auth/userAuth";
import { v4 } from "uuid";
import Swal from 'sweetalert2';
import { toast } from "react-toastify";

interface User {
    _id: string;
    name: string;
    lastName: string;
}

interface Comment {
    id: string;
    content: string;
    userId: User;
    date: Date;
    userName: string;
}

interface Post {
    _id: string;
    image: string;
    description: string;
    date: Date;
    userId: User;
    comments: Comment[];
    likes: string[];
    likedByCurrentUser: boolean
}

function PostSaved() {
    const [posts, setPosts] = useState<Post[]>([]);
    const currentUser = useUserStore(state => state.user);
    const [comment, setComment] = useState('');
    const [showTextAreas, setShowTextAreas] = useState({}) as any;
    const [commentsVisibility, setCommentsVisibility] = useState({}) as any;
    const [hoveredCommentId, setHoveredCommentId] = useState(null);

    useEffect(() => {
        const postCollectionRef = collection(db, 'posts');
        const unsubscribe = onSnapshot(postCollectionRef, (snapshot) => {
            const newPosts: Post[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userId === currentUser?._id) {
                    const likedByCurrentUser = data.likes.includes(currentUser?._id);
                    newPosts.push({
                        _id: doc.id,
                        image: data.imageUrl,
                        description: data.description,
                        date: new Date(data.date.toDate()),
                        userId: data.userId,
                        comments: data.comments,
                        likes: data.likes || [],
                        likedByCurrentUser
                    });
                }
            });
            setPosts(newPosts);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const addCommentToPost = async (postId: string, commentContent: string) => {
        const postRef = doc(db, 'posts', postId);
        try {
            const postDoc = await getDoc(postRef);
            if (postDoc.exists()) {
                const updatedComments = [...postDoc.data().comments, {
                    content: commentContent,
                    userName: currentUser?.name,
                    userId: currentUser?._id,
                    date: new Date(),
                    id: v4()
                }];
                await updateDoc(postRef, {
                    comments: updatedComments
                });
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const deleteComment = async (commentId: string, postId: any) => {
        const postRef = doc(db, 'posts', postId);
        const postDoc = await getDoc(postRef);
        if (postDoc.exists()) {
            const updatedComments = postDoc.data().comments.filter((comment: any) => comment.id !== commentId);
            await updateDoc(postRef, {
                comments: updatedComments
            });
        }
    };

    const deletePost = async (postId: string) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Una vez eliminada, no podrás recuperarla",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            background: "#1f2937",
            color: "#fff"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const postRef = doc(db, 'posts', postId);
                    await deleteDoc(postRef);
                    setPosts(posts.filter(post => post._id !== postId));

                    toast.success('Publicación eliminada', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        className: "bg-[#1f2937] text-white"
                    });
                } catch (error) {
                    console.error("Error deleting post:", error);
                    toast.error('Error tratando de eliminar el post!', {
                        position: "bottom-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        className: "bg-[#1f2937] text-white"
                    });
                }
            }
        });
    };


    if (posts.length === 0) {
        return (
            <div className="flex flex-col gap-4 p-4 items-center">
                <p>No tienes publicaciones aún...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 items-center">
            {posts.map(post => {
                return (
                    <div key={post._id} className="bg-white rounded-lg shadow-md w-4/6 mb-3 flex flex-col">
                        <img src={post.image} className="w-full h-48 object-cover rounded-t-lg" />
                        <div className="p-4">
                            <div className="flex items-center mb-2">
                                <svg className={`w-6 h-6 ${post.likedByCurrentUser ? 'fill-current text-red-500' : 'text-gray-500'} cursor-default`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <p className="text-gray-700 text-lg ml-1 cursor-default">{post.likes.length}</p>
                                <svg onClick={() => {
                                    setShowTextAreas((prevState: any) => ({
                                        ...prevState,
                                        [post._id]: !prevState[post._id]
                                    }));
                                }} className={`w-6 h-6 ml-2 ${showTextAreas[post?._id] ? 'fill-current text-gray-500' : 'text-gray-500'} cursor-pointer`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-gray-700 text-lg ml-1 cursor-default">{post.comments.length}</p>
                            </div>
                            <p className="text-black text-xl mb-2">{post.description}</p>
                            {commentsVisibility[post._id] ? (
                                post.comments.map((comment: any, index) => (
                                    <div
                                        key={index}
                                        className="ml-2 flex overflow-hidden text-ellipsis w-full"
                                        onMouseEnter={() => setHoveredCommentId(comment.id)}
                                        onMouseLeave={() => setHoveredCommentId(null)}
                                    >
                                        <p className="text-gray-500 font-bold text-[14px] text-start">{comment.userName}</p>
                                        <p className="text-gray-500 ml-1 text-[14px] text-start">{comment.content}</p>
                                        {currentUser?._id === comment.userId && hoveredCommentId === comment.id && (
                                            <div className="flex ml-auto">
                                                <button onClick={() => deleteComment(comment.id, post._id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                post.comments.slice(0, 2).map((comment: any, index) => (
                                    <div
                                        key={index}
                                        className="ml-2 flex overflow-hidden text-ellipsis w-full"
                                        onMouseEnter={() => setHoveredCommentId(comment.id)}
                                        onMouseLeave={() => setHoveredCommentId(null)}
                                    >
                                        <p className="text-gray-500 font-bold text-[14px] text-start">{comment.userName}</p>
                                        <p className="text-gray-500 ml-1 text-[14px] text-start">{comment.content}</p>
                                        {currentUser?._id === comment.userId && hoveredCommentId === comment.id && (
                                            <div className="flex ml-auto">
                                                <button onClick={() => deleteComment(comment.id, post._id)} className="text-red-500">Eliminar</button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}

                            {post.comments.length > 2 && (
                                <button
                                    onClick={() => {
                                        setCommentsVisibility((prevState: any) => ({
                                            ...prevState,
                                            [post._id]: !prevState[post._id]
                                        }));
                                    }}
                                    className="load-more-comments text-gray-400 font-bold text-[14px] mt-1 ml-2"
                                >
                                    {commentsVisibility[post._id] ? "Ocultar" : "Cargar más comentarios"}
                                </button>
                            )}
                            {showTextAreas[post?._id] && (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        if (comment.trim()) {
                                            addCommentToPost(post._id, comment);
                                            setComment('');
                                            setShowTextAreas((prevState: any) => ({
                                                ...prevState,
                                                [post._id]: false
                                            }));
                                        }
                                    }}
                                    className="mt-3"
                                >
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        onChange={(e) => setComment(e.target.value)}
                                        value={comment}
                                        rows={4}
                                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        onClick={() => {
                                            setShowTextAreas((prevState: any) => ({
                                                ...prevState,
                                                [post._id]: true
                                            }));
                                        }}
                                        className="mt-1 w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
                                    >
                                        Comentar
                                    </button>
                                </form>
                            )}
                        </div>
                        <button onClick={() => deletePost(post._id)} className="font-bold text-red-500 flex justify-center mt-2 mb-3">Eliminar publicación</button>
                    </div>
                )
            })}
        </div>
    );
}

export default PostSaved