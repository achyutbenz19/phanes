import React from "react";

type BotMessageProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const BotMessage: React.FC<BotMessageProps> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className="font-sans text-semibold bg-neutral-100 border border-neutral-200 drop-shadow-sm p-3 w-fit rounded"
    >
      {children}
    </div>
  );
};

export default BotMessage;
