"use client";

import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useUser } from "@/store/useStore";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

const FetchUser = () => {
  const { setUser } = useUser();

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      (async () => {
        const user = await fetchUserProfile();
        if (user) {
          setUser(user);
        } else {
          Cookies.remove("token");
        }
      })();
    }
  }, []);

  return <div></div>;
};

export default FetchUser;
