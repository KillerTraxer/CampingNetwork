import React, { useRef, useState } from 'react'
import useUserStore from '../features/auth/userAuth';
import { imageDB, db } from '../firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { toast } from 'react-toastify';

export default function NewPostForm() {
    const [image, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const user = useUserStore(state => state.user);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageChange({ target: { files: e.dataTransfer.files } } as any);
        }
    };

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedImage = e.target.files[0];
            setImage(selectedImage);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) {
            alert('Por favor, selecciona una imagen.');
            return;
        }

        const storageRef = ref(imageDB.storage, `images/${v4()}`);

        try {
            await uploadBytes(storageRef, image);

            const imageUrl = await getDownloadURL(storageRef);

            const currentDate = new Date();

            const postData = {
                description,
                userId: user?._id!,
                imageUrl,
                comments: [],
                likes: [],
                date: currentDate,
            };

            const postsCollection = collection(db, 'posts');

            //@ts-ignore
            const docRef = await addDoc(postsCollection, postData);

            toast.success('Publicación creada con éxito!', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: "bg-[#1f2937] text-white"
            });

            setImage(null);
            setDescription('');
            setImagePreviewUrl(null);
        } catch (error) {
            console.error('Error al crear la publicación:', error);
        }
    };
    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit}>
                <div
                    className="mb-4 border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        ref={fileInputRef}
                    />
                    {imagePreviewUrl ? (
                        <img src={imagePreviewUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                    ) : (
                        <div>
                            <p className="text-gray-500">Arrastra y suelta una imagen o haz clic para seleccionar</p>
                        </div>
                    )}
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Publicar
                </button>
            </form>
        </div>
    )
}
