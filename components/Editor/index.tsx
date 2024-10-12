import Commands from "./Commands";
import getSuggestionItems from "./Items";
import renderItems from "./RenderItems";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import BlockQuote from "@tiptap/extension-blockquote";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import suggestion from "@/components/Editor/Mention/suggestion";
import { useProjectMembers } from "@/hooks/projects";
import { useRouter } from "next/router";
import { Editor } from "@tiptap/core";

interface ITiptap {
  onChange: (content: string) => void;
  value?: string;
  className?: string;
}

const Tiptap: React.FC<ITiptap> = ({ onChange, value, className }) => {
  const { projectId } = useRouter().query;
  const { data: members } = useProjectMembers(projectId?.toString()!);
  const editor = useEditor({
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    extensions: [
      StarterKit.configure(),
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount.configure({
        limit: 10000,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      BlockQuote,
      Commands.configure({
        suggestion: {
          // @ts-ignore
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
      Placeholder.configure({
        placeholder: "Type / to add elements, or @ to mention someone.",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: {
          ...suggestion,
          // @ts-ignore
          items: (props) => suggestion.items(props, members ?? []),
        },
      }),
    ],
    content: value,
  });

  return (
    <div className="editor-box w-full">
      <EditorContent
        className={cn(
          "flex text-primary prose-h1:text-4xl prose-h1:font-bold prose-h2:font-bold prose-h2:text-3xl h-16  min-w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
