import { ReactNode, useState } from "react";

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
        className="flex w-full items-center justify-between p-4 text-left text-gray-900 transition focus:outline-none dark:text-white"
        onClick={toggleOpen}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default AccordionItem;
