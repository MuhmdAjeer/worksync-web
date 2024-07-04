import React from "react";

const WorkspaceLogo = ({ name }: { name: string }) => {
  return (
    <div className="bg-custom-primary-dark h-10 w-10 rounded flex items-center justify-center">
      <span className="text-secondary text-lg">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

export default WorkspaceLogo;
