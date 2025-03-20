"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ChevronLeft, ExternalLink } from "lucide-react";
import MissingSolutionForm from "@/components/MissingSolutionForm";

interface Solution {
  title: string;
  description: string;
  videoUrl: string;
  links: string[];
}

const extractCodeforcesLinks = (text: string): string[] => {
  const regex1 = /https:\/\/codeforces\.com\/contest\/\d+\/submission\/\d+/g;
  const regex2 = /https:\/\/pastebin\.com\/[a-zA-Z0-9]+/g;
  const regex3 = /https:\/\/ideone\.com\/[a-zA-Z0-9]+/g;
  const regex4 = /https:\/\/hastebin\.com\/share\/[a-zA-Z0-9]+/g;
  return (
    text.match(regex1) ||
    text.match(regex2) ||
    text.match(regex3) ||
    text.match(regex4) ||
    []
  );
};

const extractCodechefLinks = (text: string): string[] => {
  const regex1 = /https:\/\/www\.codechef\.com\/viewsolution\/\d+/g;
  const regex2 = /https:\/\/pastebin\.com\/[a-zA-Z0-9]+/g;
  const regex3 = /https:\/\/ideone\.com\/[a-zA-Z0-9]+/g;
  return text.match(regex1) || text.match(regex2) || text.match(regex3) || [];
};

const extractLeetcodeLinks = (text: string): string[] => {
  const regex1 = /https:\/\/leetcode\.com\/[^\s]+/g;
  const regex2 = /https:\/\/ideone\.com\/[a-zA-Z0-9]+/g;
  return text.match(regex1) || text.match(regex2) || [];
};

const Solution = () => {
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [solutionLinks, setSolutionLinks] = useState<string[]>([""]);

  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const name = searchParams.get("name");
  const id = searchParams.get("id");

  const router = useRouter();

  const extractVideoId = (url: string) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const fetchCodeforcesSolution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/codeforces/${name}`);
      const data: Solution[] = await response.json();

      if (data.length > 0) {
        setVideoUrl(data[0].videoUrl);
        setCurrentSolution({
          ...data[0],
          description: extractCodeforcesLinks(data[0].description).join("\n"),
        });
      } else {
        const response = await fetch(`/api/solution/${name}`);
        const data: Solution[] = await response.json();

        if (data.length > 0) {
          setVideoUrl(data[0].videoUrl);
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
        setVideoUrl(data[0].videoUrl);
        setCurrentSolution({
          ...data[0],
          description: extractCodechefLinks(data[0].description).join("\n"),
        });
      } else {
        const response = await fetch(`/api/solution/${name}`);
        const data: Solution[] = await response.json();

        if (data.length > 0) {
          setVideoUrl(data[0].videoUrl);
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

  const fetchLeetcodeSolution = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leetcode/${name}`);
      const data: Solution[] = await response.json();

      if (data.length > 0) {
        setVideoUrl(data[0].videoUrl);
        setCurrentSolution({
          ...data[0],
          description: extractLeetcodeLinks(data[0].description).join("\n"),
        });
      } else {
        const response = await fetch(`/api/solution/${name}`);
        const data: Solution[] = await response.json();

        if (data.length > 0) {
          setVideoUrl(data[0].videoUrl);
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
      fetchLeetcodeSolution();
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
    <div className="py-4">
      <div className="flex items-end gap-4">
        <button
          className="p-1 border rounded-full border-black dark:border-white hover:cursor-pointer"
          onClick={() => router.push("/")}
        >
          <ChevronLeft className="size-5 stroke-1" />
        </button>
        <p className="capitalize text-3xl font-medium">{type}</p>
      </div>
      {!currentSolution && <p className="text-2xl font-medium mt-6">{name}</p>}
      {currentSolution ? (
        <div>
          <h1 className="text-2xl font-medium mt-6">{name}</h1>
          <div className="w-full lg:w-1/2 h-[220px] sm:h-[340px] md:h-[530px] lg:h-[380px] mt-4">
            {videoUrl && (
              <iframe
                src={`https://www.youtube.com/embed/${extractVideoId(
                  videoUrl
                )}`}
                title={currentSolution.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="h-full w-full"
              ></iframe>
            )}
          </div>
          <Link
            href={
              type === "leetcode"
                ? `https://leetcode.com/contest/${name
                    ?.split(" ")
                    .join("-")
                    .toLocaleLowerCase()}`
                : type === "codeforces"
                ? `https://codeforces.com/contest/${id}`
                : type === "codechef"
                ? `https://www.codechef.com/${id}`
                : ""
            }
            target="_blank"
            className="text-xl font-medium mt-4 flex items-center gap-2"
          >
            Visit Contest
            <ExternalLink className="size-4" />
          </Link>
          <h3 className="mt-3 text-xl font-medium">Solution Links</h3>
          <ul className="mt-3 list-decimal list-inside space-y-0.5">
            {currentSolution.description ? (
              currentSolution.description.split("\n").map(
                (link, index) =>
                  link && (
                    <li key={index}>
                      <Link
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline font-medium"
                      >
                        Problem {String.fromCharCode(65 + index)} Solution
                      </Link>
                    </li>
                  )
              )
            ) : (
              <p className="text-lg mt-2">No solution links found.</p>
            )}
          </ul>
        </div>
      ) : (
        <p className="text-lg mt-2">
          No solutions found. Add a solution for this problem.
        </p>
      )}

      {!currentSolution && !loading && (
        <MissingSolutionForm
          handleAddSolutionLink={handleAddSolutionLink}
          handleSubmit={handleSubmit}
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          solutionLinks={solutionLinks}
          handleSolutionLinkChange={handleSolutionLinkChange}
        />
      )}
    </div>
  );
};

export default Solution;
