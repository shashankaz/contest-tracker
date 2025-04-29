"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { useUser } from "@/context/userContest";
import EditProfile from "./_components/EditProfile";

interface User {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
}

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);

  const { setUser, setToken } = useUser();

  const router = useRouter();

  const params = useParams();
  console.log(params.username);

  const fetchUserProfile = async () => {
    setLoading(true);
    const response = await axios.get(`/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    setUserProfile(response.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 border">
      <div className="flex items-center gap-8">
        <div className="size-32 rounded-full">
          <Image
            src={userProfile?.profilePicture || "/default-profile.png"}
            alt="Profile Picture"
            width={128}
            height={128}
            className="h-full w-full object-cover rounded-full"
          />
        </div>
        <div>
          <h2 className="text-2xl font-medium">
            {userProfile?.name}{" "}
            <span className="italic text-lg">@{userProfile?.username}</span>
          </h2>
          <h2>{userProfile?.bio || "No bio available"}</h2>
          <div className="mt-3">
            <Button onClick={() => setEditProfile(true)}>Edit Profile</Button>
            <Button variant="secondary" className="ml-2" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {editProfile && (
        <div className="h-screen fixed top-0 left-0 right-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="max-w-xl mx-auto w-full">
            <EditProfile setEditProfile={setEditProfile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
