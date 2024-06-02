import { File } from "buffer";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

interface Iprops {
  placeHolder?: string;
  file?: globalThis.File;
  setFile: (value: React.SetStateAction<globalThis.File | undefined>) => void;
}

const AvatarInput = ({
  placeHolder = "Select Image",
  file,
  setFile,
}: Iprops) => {
  const [img, setImg] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target.files?.[0];
    if (!file) {
      return;
    }
    setFile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      if (reader.result) {
        setImg(reader.result.toString());
      }
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex items-center">
      <label className="relative overflow-hidden rounded-full">
        <input
          type="file"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          accept="image/*"
          onChange={handleChange}
        />
        {img ? (
          <Image
            src={img}
            alt="Avatar"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">{placeHolder}</span>
          </div>
        )}
      </label>
    </div>
  );
};

export default AvatarInput;
