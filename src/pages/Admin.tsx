import { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from '../features/auth/userAuth';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

interface User {
    _id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
}

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);
    const currentUser = useUserStore(state => state.user);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/users');
            const filteredUsers = response.data.filter((user: any) => user._id !== currentUser?._id);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentUser]);

    const deleteUser = async (userId: any) => {
        Swal.fire({
            title: '¿Estás seguro de eliminar este usuario?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            background: "#1f2937",
            color: "#fff"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:3000/api/users/${userId}`);
                    fetchUsers();

                    toast.success('Usuario eliminado', {
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
                    console.error("Error deleting user:", error);
                    toast.error('Error tratando usuario', {
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
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Apellidos</th>
                        <th scope="col" className="px-6 py-3">Rol</th>
                        <th scope="col" className="px-6 py-3">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 border-gray-700">
                    {!users.length ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-white">Sin usuarios.</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user._id} className="border-b">
                                <td className="px-6 py-4 font-medium whitespace-nowrap text-white">{user._id}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.name}</td>
                                <td className="px-6 py-4">{user.lastName}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <a onClick={() => deleteUser(user._id)} className="font-medium text-blue-500 hover:underline cursor-pointer">Eliminar</a>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
