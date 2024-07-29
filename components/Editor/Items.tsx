import { Editor, Range } from "@tiptap/react";

interface Items {
  title: string;
  command: (props: Command) => void;
}

interface Command {
  editor: Editor;
  range: Range;
}

const getSuggestionItems = (query: string): Items[] => {
  return [
    {
      title: "H1",
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "H2",
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "bold",
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark("bold").run();
      },
    },
    {
      title: "italic",
      command: ({ editor, range }: Command) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "Quote",
      command: ({ editor, range }: Command) => {
        // @ts-ignore
        editor.chain().focus().deleteRange(range).setBlockquote().run();
      },
    },
    {
      title: "table",
      command: ({ editor, range }: Command) => {
        editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },
    },
    {
      title: "image",
      command: ({ editor, range }: Command) => {
        console.log("call some function from parent");
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    },
  ].slice(0, 10);
};

export default getSuggestionItems;
