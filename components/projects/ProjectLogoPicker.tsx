import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import ProjectLogo from "./ProjectLogo";
import EmojiPicker from "emoji-picker-react";
import { convertHexEmojiToDecimal } from "@/lib/utils";

interface IProps {
  value?: string;
  onChange: (value: string) => void;
}
const ProjectLogoPicker: React.FC<IProps> = ({ value, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <span className="grid h-11 w-11 place-items-center rounded-md bg-secondary">
          <ProjectLogo value={value} className="text-xl" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 border-none">
        <EmojiPicker
          onEmojiClick={(emoji) => {
            onChange(convertHexEmojiToDecimal(emoji.unified));
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ProjectLogoPicker;
