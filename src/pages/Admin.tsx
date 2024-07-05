import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
}

export default function Admin() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

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
                        <th scope="col" className="px-6 py-3">
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 border-gray-700 hover:bg-gray-600">
                    {users.map(user => (
                        <tr key={user._id} className="border-b">
                            <td className="px-6 py-4 font-medium whitespace-nowrap text-white">{user._id}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.name}</td>
                            <td className="px-6 py-4">{user.lastName}</td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4 text-right">
                                <a href="#" className="font-medium text-blue-500 hover:underline">Eliminar</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
