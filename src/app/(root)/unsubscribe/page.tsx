"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Unsubscribe = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const unsubscribeEmail = async () => {
      try {
        setLoading(true);
        if (!token) {
          setError("No unsubscribe token provided");
          setStatus(false);
          return;
        }

        const response = await axios.post(
          `/api/newsletter/unsubscribe?token=${token}`
        );

        if (response.status === 200) {
          setStatus(true);
        } else {
          setStatus(false);
          setError("Failed to unsubscribe. Please try again later.");
        }
      } catch (error) {
        console.error(error);
        setStatus(false);
        setError("An error occurred while processing your request.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      unsubscribeEmail();
    } else {
      setLoading(false);
      setStatus(false);
      setError("No unsubscribe token provided");
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Processing Your Request</CardTitle>
            <CardDescription>
              Please wait while we unsubscribe your email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center">
              We&apos;re processing your unsubscribe request...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loading && status) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-green-600">
              Successfully Unsubscribed
            </CardTitle>
            <CardDescription>
              You&apos;ve been removed from our mailing list
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              You will no longer receive contest notifications from us.
              We&apos;re sorry to see you go!
            </p>
            <p className="mt-4">
              If you change your mind, you can always resubscribe on our
              website.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!loading && !status) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Unsubscribe Failed</CardTitle>
            <CardDescription>
              We couldn&apos;t process your request
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <p>The unsubscribe link appears to be invalid or has expired.</p>
            <p className="mt-4">
              Please try again or contact support if you continue to have
              issues.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">Return to Homepage</Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
};

export default Unsubscribe;
