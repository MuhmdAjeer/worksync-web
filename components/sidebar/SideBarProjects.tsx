import React, { useState } from "react";
import Typography from "../ui/Typography";
import { observer, } from "mobx-react";
import { useProject } from "@/hooks/project";
import ProjectSidebarItem from "./ProjectSidebarItem";
import { ChevronDown, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SideBarProjects = observer(() => {
  const [isCollapsed, setCollapsed] = useState(false);
  const { workspaceProjects } = useProject();

  return (
    <div className="w-full cursor-pointer space-y-2 p-4">
      <div
        onClick={() => setCollapsed((v) => !v)}
        className="flex gap-2  justify-between items-center text-center hover:bg-slate-100 rounded-md space-y-4 px-4 py-2 "
      >
        <Typography variant="p" className="font-semibold" affects="muted">
          Your projects
        </Typography>
        {isCollapsed ? (
          <ChevronRight className="text-primary !m-0  text-center h-4 w-4" />
        ) : (
          <ChevronDown className="text-primary !m-0  text-center h-4 w-4" />
        )}
      </div>

      {!isCollapsed && (
        <motion.div initial={{ x: 20 }} animate={{ x: 0 }}>
          {workspaceProjects &&
            workspaceProjects.map((x) => (
              <ProjectSidebarItem project={x} key={x.id} />
            ))}
        </motion.div>
      )}
    </div>
  );
});

export default SideBarProjects;
