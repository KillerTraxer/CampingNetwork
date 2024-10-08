import axios from "axios";
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

function RegisterForm() {
    const [userInfo, setUserInfo] = useState({ name: '', lastName: '', email: '', password: '', role: "User" });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:3000/api/register', userInfo);
            Swal.fire({
                title: 'Usuario registrado',
                text: "Ahora puedes iniciar sesión!",
                icon: 'success',
                background: "#111827",
                color: "#ffff"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login");
                }
            });
            setError("");
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Error desconocido en el servidor');
            } else {
                setError('Ocurrió un error inesperado');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="bg-gray-900 h-[100vh]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <h1 className="text-4xl text-white font-bold mb-10">Camping Network</h1>
                <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white text-center">
                            Registro
                        </h1>
                        {error && <p className="text-red-500 bg-red-200 p-3 text-center rounded-md">{error}</p>}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-white">Nombre</label>
                                <input type="text" name="name" id='name' value={userInfo.name} onChange={handleChange} className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Mario" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-white">Apellidos</label>
                                <input type="text" name="lastName" id='lastName' value={userInfo.lastName} onChange={handleChange} className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Garcia" required />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-white">Email</label>
                                <input autoComplete="new-password" type="email" name="email" id='email' value={userInfo.email} onChange={handleChange} className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name@company.com" required />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Contraseña</label>
                                <input autoComplete="new-password" type="password" name="password" id="password" value={userInfo.password} onChange={handleChange} placeholder="••••••••" className="border rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                            </div>
                            <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
                                {!loading ? (
                                    <>
                                        Iniciar Sesión
                                    </>
                                ) : (
                                    <>
                                        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Cargando...</span>
                                    </>
                                )}
                            </button>
                            <p className="text-sm font-light text-gray-400">
                                Tienes cuenta? <a href="/login" className="font-medium hover:underline text-blue-500">Inicar sesión</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RegisterForm