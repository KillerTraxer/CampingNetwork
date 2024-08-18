import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebaseConfig';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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
}

function Adminposts() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        const postCollectionRef = collection(db, 'posts');
        const unsubscribe = onSnapshot(postCollectionRef, (snapshot) => {
            const newPosts: Post[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                newPosts.push({
                    _id: doc.id,
                    image: data.imageUrl,
                    description: data.description,
                    date: new Date(data.date.toDate()),
                    userId: data.userId,
                    comments: data.comments,
                    likes: data.likes || [],
                });
            });
            setPosts(newPosts);
        });
        return () => unsubscribe();
    }, []);

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

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-400">
                <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Id</th>
                        <th scope="col" className="px-6 py-3">Descripción</th>
                        <th scope="col" className="px-6 py-3">Comentarios</th>
                        <th scope="col" className="px-6 py-3">Likes</th>
                        <th scope="col" className="px-6 py-3">Fecha</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 border-gray-700">
                    {!posts.length ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-white">Sin publicaciones.</td>
                        </tr>
                    ) : (
                        posts.map(post => (
                            <tr key={post._id} className="border-b">
                                <td className="px-6 py-4 font-medium whitespace-nowrap text-white">{post._id}</td>
                                <td className="px-6 py-4">{post.description}</td>
                                <td className="px-6 py-4">{post.comments.length}</td>
                                <td className="px-6 py-4">{post.likes.length}</td>
                                <td className="px-6 py-4">{post.date.toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <a onClick={() => deletePost(post._id)} className="font-medium text-blue-500 hover:underline cursor-pointer">Eliminar</a>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Adminposts