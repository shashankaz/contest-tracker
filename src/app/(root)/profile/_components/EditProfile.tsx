import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/context/userContest";
import { X } from "lucide-react";
import Image from "next/image";

interface EditProfileProps {
  setEditProfile: (value: boolean) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ setEditProfile }) => {
  const { user } = useUser();

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information here.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action="" className="space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src={user?.profilePicture || ""}
              alt="Profile Picture"
              width={100}
              height={100}
              className="size-24 object-cover rounded-full"
            />
            <Label htmlFor="profilePicture">Change Profile Picture</Label>
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              className="border rounded p-2"
              value={user?.name || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              className="border rounded p-2"
              value={user?.username || ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" placeholder="Enter your bio" className="h-28" />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
      <button
        className="absolute top-2 right-2 sm:top-3 sm:right-3 hover:bg-gray-800 dark:hover:bg-gray-400 hover:text-white dark:hover:text-black transition-colors cursor-pointer p-1 rounded-full"
        onClick={() => {
          setEditProfile(false);
        }}
      >
        <X className="size-3 sm:size-4" />
      </button>
    </Card>
  );
};

export default EditProfile;
