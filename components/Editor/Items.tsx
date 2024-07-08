// @ts-nocheck
import { Editor } from "@tiptap/react";

const getSuggestionItems = (query) => {
  return [
    {
      title: "H1",
      command: ({ editor, range }) => {
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
      command: ({ editor, range }) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 6 })
          .run();
      },
    },
    {
      title: "code",
      command: ({ editor, range }: { editor: Editor }) => {
        if (range)
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .clearNodes()
            .insertTable({ rows: 3, cols: 3 })
            .run();
        else
          editor
            .chain()
            .focus()
            .clearNodes()
            .insertTable({ rows: 3, cols: 3 })
            .run();
      },
    },
    {
      title: "italic",
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark("italic").run();
      },
    },
    {
      title: "image",
      command: ({ editor, range }) => {
        console.log("call some function from parent");
        editor.chain().focus().deleteRange(range).setNode("paragraph").run();
      },
    },
  ]
    .filter((item) =>
      item.title.toLowerCase().startsWith(query.query.toLowerCase())
    )
    .slice(0, 10);
};

export default getSuggestionItems;
