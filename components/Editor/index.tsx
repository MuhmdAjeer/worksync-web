import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Commands from "./Commands";
import getSuggestionItems from "./Items";
import renderItems from "./RenderItems";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import BlockQuote from "@tiptap/extension-blockquote";
import React from "react";
import { cn } from "@/lib/utils";

interface ITiptap {
  onChange: (content: string) => void;
  value?: string;
}

const Tiptap: React.FC<ITiptap> = ({ onChange, value }) => {
  const editor = useEditor({
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    extensions: [
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      StarterKit,
      BlockQuote,
      Commands.configure({
        suggestion: {
          // @ts-ignore
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    content: value ?? "<p>Use / command to see different options</p> ",
  });

  return (
    <div className="editor-box">
      <EditorContent
        className={cn(
          "flex text-primary prose-h1:text-4xl prose-h1:font-bold prose-h2:font-bold prose-h2:text-3xl min-h-[60px] min-w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        )}
        editor={editor}
      />
    </div>
  );
};

export default Tiptap;
