import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RatingSectionProps {
  rating: number;
  submitRating: (value: number) => void;
}

export const RatingSection = ({ rating, submitRating }: RatingSectionProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Rate Your Experience</h3>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            variant={rating >= value ? "default" : "outline"}
            size="sm"
            onClick={() => submitRating(value)}
            className="flex items-center gap-5 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100"
          >
            <Star className="h-4 w-4" />
            {value}
          </Button>
        ))}
      </div>
    </Card>
  );
};