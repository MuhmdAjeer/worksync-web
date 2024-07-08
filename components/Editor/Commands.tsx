import { Extension, Node } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";

const Commands = Node.create({
  name: "mention",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        startOfLine: true,
        // @ts-ignore
        command: ({ editor, range, props }) => {
          props.command({ editor, range, props });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

export default Commands;
