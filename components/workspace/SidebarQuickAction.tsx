import React, { useState } from "react";
import { Button } from "../ui/button";
import { EditIcon, SearchIcon } from "lucide-react";
import Typography from "../ui/Typography";
import CreateIssueModal from "../issues/create-issue-modal";

const SidebarQuickAction = () => {
  const [modal, setModal] = useState(false);
  return (
    <div className="mx-4 flex gap-2">
      <Button
        onClick={() => setModal(true)}
        variant="outline"
        className="flex gap-2  w-full"
        size="sm"
      >
        <EditIcon className="h-4 w-4" />
        New Issue
      </Button>
      <Button size="sm" variant="outline">
        <SearchIcon className="h-4 w-4" />
      </Button>
      <CreateIssueModal onClose={() => setModal(false)} open={modal} />
    </div>
  );
};

export default SidebarQuickAction;
