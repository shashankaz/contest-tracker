import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";

interface MissingSolutionFormProps {
  handleAddSolutionLink: () => void;
  handleSubmit: () => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
  solutionLinks: string[];
  handleSolutionLinkChange: (index: number, value: string) => void;
}

const videoUrlSchema = z.string().url("Invalid URL format for Video URL");
const solutionLinksSchema = z.array(
  z.string().url("Invalid URL format for solution link")
);

const MissingSolutionForm = ({
  handleAddSolutionLink,
  handleSubmit,
  videoUrl,
  setVideoUrl,
  solutionLinks,
  handleSolutionLinkChange,
}: MissingSolutionFormProps) => {
  const validateForm = () => {
    try {
      videoUrlSchema.parse(videoUrl);
      solutionLinksSchema.parse(solutionLinks);
      handleSubmit();
    } catch (e) {
      if (e instanceof z.ZodError) {
        alert(e.errors.map((error) => error.message).join("\n"));
      }
    }
  };

  return (
    <div className="mt-4">
      <h2 className="text-xl font-medium">Add Solution</h2>
      <div className="mt-2">
        <Label>Video URL</Label>
        <Input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="mt-2 w-full md:w-[400px]"
        />
      </div>
      <div className="mt-2">
        <Label className="mb-2">Solution Links</Label>
        {solutionLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-3 mb-2">
            <Input
              type="text"
              value={link}
              onChange={(e) => handleSolutionLinkChange(index, e.target.value)}
              className="w-full md:w-[400px]"
            />
            {index === solutionLinks.length - 1 && (
              <Button onClick={handleAddSolutionLink}>Add More</Button>
            )}
          </div>
        ))}
      </div>
      <Button onClick={validateForm} className="mt-4">
        Submit
      </Button>
    </div>
  );
};

export default MissingSolutionForm;
