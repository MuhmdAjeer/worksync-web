// @ts-nocheck
import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import CommandsList from "./CommandsList";

const renderItems = () => {
  let component;
  let popup;

  return {
    onStart: (props) => {
      component = new ReactRenderer(CommandsList, {
        props,
        editor: props.editor,
      });

      const editorElement = document.querySelector(".editor-box");

      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => editorElement,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },

    onUpdate(props) {
      console.log({ props });

      component.updateProps(props);

      popup[0].setProps({
        getReferenceClientRect: props.clientRect,
      });
    },
    onKeyDown(props) {
      if (props.event.key === "Escape") {
        popup[0].hide();

        return true;
      }

      return component.ref?.onKeyDown(props);
    },
    onExit() {
      popup[0].destroy();
      component.destroy();
    },
  };
};

export default renderItems;
