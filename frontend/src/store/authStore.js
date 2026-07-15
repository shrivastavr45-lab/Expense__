import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user:         null,
      token:        null,
      refreshToken: null,

      login: (data) => {
        localStorage.setItem('accessToken',  data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({
          user: {
            id:        data.id,
            email:     data.email,
            username:  data.username,
            firstName: data.firstName,
            lastName:  data.lastName,
            roles:     data.roles,
            currency:  data.currency,
          },
          token:        data.accessToken,
          refreshToken: data.refreshToken,
        });
      },

      updateUser: (userData) =>
        set(state => ({ user: { ...state.user, ...userData } })),

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, refreshToken: null });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.roles?.includes('ROLE_ADMIN') ?? false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({ user: state.user, token: state.token }),
    }
  )
);
