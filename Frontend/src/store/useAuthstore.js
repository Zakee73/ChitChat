import { create } from "zustand";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

const useAuthStore = create((set) => ({
  authUser: getStoredUser(),

  setAuthUser: (user) => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    set({ authUser: user });
  },

  logout: () => {
    localStorage.removeItem("user");
    set({ authUser: null });
  },
}));

export default useAuthStore;