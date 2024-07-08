// src/Tiptap.tsx
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../ui/button";
import Commands from "./Commands";
import getSuggestionItems from "./Items";
import renderItems from "./RenderItems";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

// define your extension array
const extensions = [StarterKit];

const content = "<p>Hello World!</p>";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      StarterKit,
      Commands.configure({
        suggestion: {
          // @ts-ignore
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    content: "<p>Use / command to see different options</p> ",
  });

  return (
    <div>
      <Button
        onClick={() => editor?.chain().focus().toggleBold().run()}
        size="sm"
      >
        Code
      </Button>
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
