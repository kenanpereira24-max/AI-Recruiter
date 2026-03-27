import { create } from "zustand";

const useStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  profileData: {
    summary: "",
    skills: [],
    experiences: [],
    projects: [],
    education: [],
  },
  setUser: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      profileData: {
        summary: "",
        skills: [],
        experiences: [],
        projects: [],
        education: [],
      },
    });
  },
  setProfileData: (data) =>
    set((state) => ({
      profileData: { ...state.profileData, ...data },
    })),
}));

export default useStore;
