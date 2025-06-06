"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import Cookies from "js-cookie";
import {
  ExternalLink,
  Trash,
  Settings,
  BookmarkCheck,
  Shield,
  Bell,
  LogOut,
  User,
  Key,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { addHours, addMinutes } from "date-fns";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import EditProfile from "./_components/EditProfile";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/userContest";
import { contestLink } from "@/lib/contestLink";

interface Contest {
  contest_id: string;
  contest_name: string;
  contest_type: string;
  contest_phase: number;
  contest_date_start: string;
  contest_date_end: string;
  contest_origin: string;
}

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [savedContests, setSavedContests] = useState<Contest[]>([]);
  const [contestsLoading, setContestsLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const { user, setUser, setToken } = useUser();
  const router = useRouter();
  // const params = useParams();

  const fetchSavedContests = async () => {
    try {
      setContestsLoading(true);
      const response = await axios.get("/api/user/saved-contests", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      setSavedContests(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setContestsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchSavedContests();

    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const handleDeleteContest = async (contest_id: string) => {
    try {
      const response = await axios.delete(
        `/api/user/delete-contest/?contestId=${contest_id}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Contest removed from bookmarks");
        let updatedBookmarks = JSON.parse(
          localStorage.getItem("bookmarkedContests") || "[]"
        );
        updatedBookmarks = updatedBookmarks.filter(
          (bookmarkId: string) => bookmarkId !== contest_id
        );
        setSavedContests(updatedBookmarks);
        localStorage.setItem(
          "bookmarkedContests",
          JSON.stringify(updatedBookmarks)
        );
      } else {
        toast.error("Failed to remove contest. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove contest. Please try again later.");
    }
  };

  const handleContestsAlert = async (checked: boolean) => {
    try {
      const response = await axios.post(
        "/api/user/update-preferences",
        {
          preferences: { newsletterSubscribed: checked },
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Contest alerts updated");
        setUser({
          ...user!,
          newsletterSubscribed: checked,
        });
      } else {
        toast.error("Failed to update contest alerts. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update contest alerts. Please try again later.");
    }
  };

  const handleContestsTimer = async (value: string) => {
    try {
      const response = await axios.post(
        "/api/user/update-preferences",
        {
          preferences: { reminderDelay: Number(value) },
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Reminder delay updated");
        setUser({
          ...user!,
          reminderDelay: Number(value),
        });
      } else {
        toast.error("Failed to update reminder delay. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update reminder delay. Please try again later.");
    }
  };

  const reminderDelayValue = () => {
    if (user?.reminderDelay) {
      switch (user.reminderDelay) {
        case 6:
          return "6";
        case 5:
          return "5";
        case 4:
          return "4";
        case 3:
          return "3";
        case 2:
          return "2";
        case 1:
          return "1";
        case 0.5:
          return "0.5";
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password cannot be the same as current password");
      return;
    }

    try {
      setPasswordLoading(true);
      const response = await axios.post(
        "/api/user/update-password",
        {
          oldPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Invalid password. Please try again.");
        } else if (error.response?.status === 404) {
          toast.error("User not found. Please try again.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/user/delete-account", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.status === 200) {
        toast.success("Account deleted successfully!");
        handleLogout();
      } else {
        toast.error("Failed to delete account. Please try again later.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const adjustDate = (dateString: string) => {
    return addMinutes(addHours(new Date(dateString), -5), -30);
  };

  if (!user) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-10">
        <Navbar />
        <div className="py-6">
          <div className="flex items-center gap-8">
            <Skeleton className="size-32 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-10 pb-10">
      <Navbar />

      <div className="py-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
          <div className="size-32 rounded-full overflow-hidden">
            <Image
              src={user?.profilePicture || "/placeholder.jpg"}
              alt="Profile Picture"
              width={128}
              height={128}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">@{user?.username}</p>
            <p className="mt-2 max-w-md">{user?.bio || "No bio available"}</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              <Button onClick={() => setEditProfile(true)} size="sm">
                <User className="size-4" />
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {editProfile && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
            <div className="max-w-xl mx-auto w-full">
              <EditProfile setEditProfile={setEditProfile} />
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="contests" className="mt-6">
        <TabsList className="grid grid-cols-2 md:w-[400px]">
          <TabsTrigger value="contests">
            <BookmarkCheck className="size-4" />
            Saved Contests
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="size-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Contests</CardTitle>
              <CardDescription>
                Manage your saved coding contests from different platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contestsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-24 w-full" />
                  ))}
                </div>
              ) : savedContests.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {savedContests.map((contest, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">
                              {contest.contest_name}
                            </CardTitle>
                            <CardDescription className="capitalize">
                              {contest.contest_origin}
                            </CardDescription>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Remove saved contest?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove the contest from your saved
                                  list. You can always save it again later.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteContest(contest.contest_id)
                                  }
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm">
                          <p>
                            Start:{" "}
                            {formatDate(adjustDate(contest.contest_date_start))}
                          </p>
                          <p>
                            End:{" "}
                            {formatDate(adjustDate(contest.contest_date_end))}
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Link
                          href={contestLink(
                            contest.contest_origin,
                            contest.contest_id
                          )}
                          target="_blank"
                          title="Visit Contest"
                        >
                          <Button variant="outline" size="sm">
                            <ExternalLink className="mr-1 h-3 w-3" />
                            Visit
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No saved contests found
                  </p>
                  <Link href="/">
                    <Button variant="outline" className="mt-4">
                      Browse Contests
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="contest-alerts" className="flex-1">
                    Contest alerts
                  </Label>
                  <Switch
                    id="contest-alerts"
                    checked={user ? user.newsletterSubscribed : false}
                    onCheckedChange={handleContestsAlert}
                  />
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3">Reminder timing</h4>
                  <Select
                    defaultValue={reminderDelayValue()}
                    onValueChange={handleContestsTimer}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select reminder time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">Before 6 hours</SelectItem>
                      <SelectItem value="5">Before 5 hours</SelectItem>
                      <SelectItem value="4">Before 4 hours</SelectItem>
                      <SelectItem value="3">Before 3 hours</SelectItem>
                      <SelectItem value="2">Before 2 hours</SelectItem>
                      <SelectItem value="1">Before 1 hour</SelectItem>
                      <SelectItem value="0.5">Before 30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-3">
                    Platforms (Coming soon)
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Codeforces",
                      "CodeChef",
                      "LeetCode",
                      "GeeksforGeeks",
                      "AtCoder",
                    ].map((platform) => (
                      <div
                        key={platform}
                        className="flex items-center justify-between"
                      >
                        <Label
                          htmlFor={`platform-${platform.toLowerCase()}`}
                          className="flex-1"
                        >
                          {platform}
                        </Label>
                        <Checkbox
                          id={`platform-${platform.toLowerCase()}`}
                          defaultChecked
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="mr-2 h-5 w-5" />
                    Password Reset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? (
                        <p className="flex items-center gap-2">
                          Updating
                          <Loader2 className="h-8 w-8 animate-spin" />
                        </p>
                      ) : (
                        <p>Update Password</p>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5" />
                    Account Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/forgot-password">
                    <Button variant="outline" className="w-full mb-4">
                      Forgot Password
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Please note: This action is final. Your account and
                          all related data will be permanently removed from our
                          servers. You will not be able to register a new
                          account using the same email address.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleAccountDelete}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
