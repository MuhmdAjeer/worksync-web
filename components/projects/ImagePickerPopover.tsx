import React, { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PROJECT_UNSPLASH_COVERS } from "./create-project-modal";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface IProps {
  onChange: (img: string) => void;
  selectedImage: string;
}

const ImagePickerPopover: FC<IProps> = ({ selectedImage, onChange }) => {
  return (
    <Popover modal>
      <PopoverTrigger className="cursor-pointer  shadow-sm bg-white text-xs rounded p-1 px-2">
        Change cover
      </PopoverTrigger>
      <PopoverContent className="w-[36rem]">
        <ScrollArea className="h-96">
          <div className="grid grid-cols-3 gap-2 m-3">
            {PROJECT_UNSPLASH_COVERS.map((cover) => (
              <Image
                onClick={() => onChange(cover)}
                className={cn(
                  "object-cover h-full rounded-lg w-full cursor-pointer",
                  selectedImage === cover &&
                    "outline outline-custom-primary-dark outline-2"
                )}
                src={cover}
                key={cover}
                width={0}
                height={0}
                sizes="100vw"
                alt="cover image"
              />
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default ImagePickerPopover;
