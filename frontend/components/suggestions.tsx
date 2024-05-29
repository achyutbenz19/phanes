import { ClickProps } from "@/lib/types";

export const suggestions = [
  { text: "Order Dominos pizza.", emoji: "🍕" },
  { text: "I want to get some Starbucks.", emoji: "☕" },
  { text: "Order protein powder from Gymsharks.", emoji: "💪" },
  { text: "Visit youlearn.ai", emoji: "☘️" },
];

const Suggestions = ({ handleClick }: ClickProps) => {
  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="border cursor-pointer hover:bg-muted drop-shadow-sm text-sm rounded p-2 flex justify-between items-center"
          onClick={() => handleClick(suggestion.text)}
        >
          <span>{suggestion.text}</span>
          <span className="text-lg ml-1">{suggestion.emoji}</span>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;
