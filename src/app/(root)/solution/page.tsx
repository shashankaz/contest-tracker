"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Solution {
  title: string;
  description: string;
  videoUrl: string;
  links: string[];
}

const extractCodeforcesLinks = (text: string): string[] => {
  const regex = /https:\/\/codeforces\.com\/contest\/\d+\/submission\/\d+/g;
  return text.match(regex) || [];
};

const extractCodechefLinks = (text: string): string[] => {
  const regex = /https:\/\/www\.codechef\.com\/viewsolution\/\d+/g;
  return text.match(regex) || [];
};

const Solution = () => {
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [solutionLinks, setSolutionLinks] = useState<string[]>([""]);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const name = searchParams.get("name");

  const router = useRouter();

  const fetchCodeforcesSolution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/codeforces/${name}`);
      const data: Solution[] = await response.json();

      if (data.length > 0) {
        setCurrentSolution({
          ...data[0],
          description: extractCodeforcesLinks(data[0].description).join("\n"),
        });
      } else {
        const response = await fetch(`/api/solution/${name}`);
        const data: Solution[] = await response.json();

        if (data.length > 0) {
          setCurrentSolution({
            ...data[0],
            description: data[0].links.join("\n"),
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCodechefSolution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/codechef/${name}`);
      const data: Solution[] = await response.json();

      if (data.length > 0) {
        setCurrentSolution({
          ...data[0],
          description: extractCodechefLinks(data[0].description).join("\n"),
        });
      } else {
        const response = await fetch(`/api/solution/${name}`);
        const data: Solution[] = await response.json();

        if (data.length > 0) {
          setCurrentSolution({
            ...data[0],
            description: data[0].links.join("\n"),
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (type === "codeforces" && name) {
      fetchCodeforcesSolution();
    } else if (type === "codechef" && name) {
      fetchCodechefSolution();
    } else if (type === "leetcode" && name) {
      fetchCodeforcesSolution();
    }
  }, [type, name]);

  const handleAddSolutionLink = () => {
    setSolutionLinks([...solutionLinks, ""]);
  };

  const handleSolutionLinkChange = (index: number, value: string) => {
    const newSolutionLinks = [...solutionLinks];
    newSolutionLinks[index] = value;
    setSolutionLinks(newSolutionLinks);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/solution", {
        title: name,
        videoUrl: videoUrl,
        links: solutionLinks,
      });

      if (response.status === 201) {
        router.push("/");
      }
      setVideoUrl("");
      setSolutionLinks([""]);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Image
          src="/loading.svg"
          height={100}
          width={100}
          alt="Loading"
          className="dark:invert"
        />
        <h1 className="text-lg mt-3 font-medium text-center">
          Please wait, we are retrieving the contest details for you.
        </h1>
      </div>
    );
  }

  return (
    <div className="h-screen py-4">
      <div className="flex items-end gap-4">
        <button
          className="p-1 border rounded-full border-black dark:border-white hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="size-5 stroke-1" />
        </button>
        <p className="capitalize text-3xl font-medium">{type}</p>
      </div>
      {!currentSolution && <p className="text-2xl font-medium mt-2">{name}</p>}
      {currentSolution ? (
        <div>
          <Link
            href={currentSolution.videoUrl}
            target="_blank"
            className="text-2xl font-medium mt-6 hover:underline flex items-center gap-2"
            title="Watch video"
          >
            {name}
            <ExternalLink className="size-6 hidden sm:block" />
          </Link>
          <ul className="mt-3 list-decimal list-inside space-y-0.5">
            {currentSolution.description ? (
              currentSolution.description.split("\n").map((link, index) => (
                <li key={index}>
                  <Link
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                  >
                    Problem {index + 1}
                  </Link>
                </li>
              ))
            ) : (
              <p className="text-lg mt-2">
                No solutions found. Add a solution for this problem.
              </p>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-lg mt-2">
          No solutions found. Add a solution for this problem.
        </p>
      )}

      {!currentSolution && !loading && (
        <div className="mt-4">
          <h2 className="text-xl font-medium">Add Solution</h2>
          <div className="mt-2">
            <Label>Video URL</Label>
            <Input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="mt-2 w-[400px]"
            />
          </div>
          <div className="mt-2">
            <Label className="mb-2">Solution Links</Label>
            {solutionLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  type="text"
                  value={link}
                  onChange={(e) =>
                    handleSolutionLinkChange(index, e.target.value)
                  }
                  className="w-[400px]"
                />
                {index === solutionLinks.length - 1 && (
                  <Button onClick={handleAddSolutionLink}>Add More</Button>
                )}
              </div>
            ))}
          </div>
          <Button onClick={handleSubmit} className="mt-4">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Solution;
