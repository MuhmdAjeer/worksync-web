import { ReactRenderer } from "@tiptap/react";
import tippy, { Instance } from "tippy.js";
import MentionList from "./MentionList";
import { ProjectMemberDto } from "@/generated/dto/project-member-dto";
import { Editor } from "@tiptap/core";
import { SuggestionOptions, SuggestionProps } from "@tiptap/suggestion";

interface MentionPluginProps {
  query: string;
  editor: any; // You can replace this with the actual type from the Tiptap editor if you have it
  clientRect?: DOMRect;
  event?: KeyboardEvent;
}

const suggestion = {
  items: ({ query }: { query: string }, users: ProjectMemberDto[]) => {
    return users
      // .filter((item) =>
      //   item.user.username?.toLowerCase().startsWith(query.toLowerCase()),
      // )
      .map((x) => x.user.username)
      .slice(0, 5);
  },

  render: () => {
    let component: ReactRenderer | null = null;
    let popup: Instance[] | null = null;

    return {
      onStart: (props: MentionPluginProps) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        // @ts-ignore
        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props: MentionPluginProps) {
        component?.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.[0].setProps({
          // @ts-ignore
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props: MentionPluginProps) {
        if (props.event?.key === "Escape") {
          popup?.[0].hide();
          return true;
        }

        //@ts-ignore
        return component?.ref?.onKeyDown?.(props) ?? false;
      },

      onExit() {
        popup?.[0].destroy();
        component?.destroy();
      },
    };
  },
};

export default suggestion;
