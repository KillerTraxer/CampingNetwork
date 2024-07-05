import create from 'zustand';

interface User {
    _id: string;
    email: string;
    name: string;
    lastName: string;
    role: string;
}

interface UserStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
    init: () => void;
}

//@ts-ignore
const useUserStore = create<UserStore>((set, get) => ({
    user: null,
    setUser: (user) => {
        set({ user });
        localStorage.setItem('user', JSON.stringify(user));
    },
    logout: () => {
        set({ user: null });
        localStorage.removeItem('user');
    },
    init: () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            set({ user: JSON.parse(storedUser) });
        }
    }
}));

export default useUserStore;