import { useState, ReactNode } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

type AccordionItemProps = {
  title: string;
  children: ReactNode;
};

const AccordionItem = ({ title, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full flex justify-between items-center p-4 text-left text-gray-900 dark:text-white focus:outline-none transition"
        onClick={toggleOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default AccordionItem;
