import imagePost1 from "../assets/camping1.jpeg"
import imagePost2 from "../assets/camping2.jpeg";

interface Post {
    _id: string;
    image: string;
    description: string;
    date: Date;
    userId: {
        _id: string;
        name: string;
        lastName: string;
    };
}

function Home() {
    const posts: Post[] = [ // Array de posts estáticos
        {
            _id: '1',
            image: imagePost1,
            description: 'Esta es la descripción de la primera publicación.',
            date: new Date(),
            userId: {
                _id: 'user1',
                name: 'Juan',
                lastName: 'Pérez',
            },
        },
        {
            _id: '2',
            image: imagePost2,
            description: 'Otra publicación interesante.',
            date: new Date(),
            userId: {
                _id: 'user2',
                name: 'María',
                lastName: 'Gómez',
            },
        },
        {
            _id: '3',
            image: imagePost2,
            description: 'Otra publicación interesante.',
            date: new Date(),
            userId: {
                _id: 'user2',
                name: 'María',
                lastName: 'Gómez',
            },
        },
    ];

    return (
        <div className="flex flex-col gap-4 p-4 items-center">
            {posts.map(post => (
                <div key={post._id} className="bg-white rounded-lg shadow-md w-4/6 mb-3">
                    <img src={post.image} className="w-full h-48 object-cover rounded-t-lg" />
                    <div className="p-4">
                        <div className="flex items-center mb-2">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {/* Ícono de corazón (like) */}
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <svg className="w-6 h-6 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {/* Ícono de comentario */}
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className="text-gray-700">{post.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;
