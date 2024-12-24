import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface ProgressSectionProps {
  progress: number;
  updateProgress: (progress: number) => void;
}

export const ProgressSection = ({ progress, updateProgress }: ProgressSectionProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Progress</h3>
      <Progress value={progress} className="mb-2" />
      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateProgress(Math.min(progress + 10, 100))}
        >
          Update Progress
        </Button>
        <span className="text-sm text-gray-500">{progress}% Complete</span>
      </div>
    </Card>
  );
};