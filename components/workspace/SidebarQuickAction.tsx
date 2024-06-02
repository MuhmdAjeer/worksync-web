import React from "react";
import { Button } from "../ui/button";
import { EditIcon, SearchIcon } from "lucide-react";
import Typography from "../ui/Typography";

const SidebarQuickAction = () => {
  return (
    <div className="mx-4 flex gap-2">
      <Button variant="outline" className="flex gap-2  w-full" size="sm">
        <EditIcon className="h-4 w-4" />
        <p>New Issue</p>
      </Button>
      <Button size="sm" variant="outline">
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SidebarQuickAction;
