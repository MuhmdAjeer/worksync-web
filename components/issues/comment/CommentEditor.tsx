import suggestion from "@/components/Editor/Mention/suggestion";
import { useProjectMembers } from "@/hooks/projects";
import { cn } from "@/lib/utils";
import Blockquote from "@tiptap/extension-blockquote";
import Highlight from "@tiptap/extension-highlight";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import {
  CodeIcon,
  FontBoldIcon,
  FontItalicIcon,
  ImageIcon,
  ListBulletIcon,
  QuoteIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ListOrderedIcon, LucideIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Image from "@tiptap/extension-image";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { UploadService } from "@/services/upload.service";
import { TypeEnum } from "@/generated/dto/file-upload-request-dto";
import { toast } from "sonner";

interface MarkItem {
  id: string;
  icon: typeof UnderlineIcon | LucideIcon;
  name: string;
  type: "node" | "mark";
}

const MarkItems: MarkItem[] = [
  { id: "bold", name: "bold", icon: FontBoldIcon, type: "mark" },

  { id: "italic", name: "italic", icon: FontItalicIcon, type: "mark" },
  { id: "strike", name: "strike", icon: StrikethroughIcon, type: "mark" },
  { id: "underline", name: "underline", icon: UnderlineIcon, type: "mark" },
  { id: "bulletlist", name: "listItem", icon: ListBulletIcon, type: "node" },
  {
    id: "numberlist",
    name: "orderedlist",
    icon: ListOrderedIcon,
    type: "node",
  },
  { id: "todolist", name: "todolist", icon: ListOrderedIcon, type: "node" },
  { id: "qoute", name: "quote", icon: QuoteIcon, type: "node" },
  { id: "code", name: "code", icon: CodeIcon, type: "node" },
  { id: "image", name: "image", icon: ImageIcon, type: "node" },
];
const uploadService = new UploadService();

interface IProps {
  handleSubmit: (comment_html: string | undefined) => void;
}
const CommentEditor: React.FC<IProps> = ({ handleSubmit }) => {
  const { projectId } = useRouter().query;
  const { data: members } = useProjectMembers(projectId?.toString()!);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const ImageExtension = Image.extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        "data-fullscreen": {
          default: null,
          parseHTML: (element) => element.getAttribute("data-fullscreen"),
          renderHTML: (attributes) => {
            if (!attributes["data-fullscreen"]) {
              return {};
            }
            return { "data-fullscreen": attributes["data-fullscreen"] };
          },
        },
      };
    },
    addNodeView() {
      return ({ node, HTMLAttributes }) => {
        const container = document.createElement("div");
        container.classList.add("image-container", "relative", "group");

        const img = document.createElement("img");
        container.style.width = "302px";
        container.style.aspectRatio = "1.7848 / 1";
        container.classList.add("m-4");
        img.classList.add(
          "rounded-xl",
          "group-hover:border",
          "group-hover:border-custom-primary",
          "group-hover:border-2",
        );
        Object.entries(HTMLAttributes).forEach(([key, value]) => {
          img.setAttribute(key, value as string);
        });

        const fullScreenButton = document.createElement("button");
        fullScreenButton.classList.add(
          "full-screen-button",
          "absolute",
          "top-2",
          "right-2",
          "bg-white",
          "rounded-full",
          "p-1",
          "shadow-md",
          "opacity-0",
          "group-hover:opacity-100",
          "transition-opacity",
        );
        fullScreenButton.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="gray" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		  
            <polyline points="15 3 21 3 21 9"></polyline>
            <polyline points="9 21 3 21 3 15"></polyline>
            <line x1="21" y1="3" x2="14" y2="10"></line>
            <line x1="3" y1="21" x2="10" y2="14"></line>
          </svg>
        `;
        fullScreenButton.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          setEnlargedImage(img.src);
        });

        container.appendChild(img);
        container.appendChild(fullScreenButton);

        return {
          dom: container,
          update: (updatedNode) => {
            if (updatedNode.type !== node.type) return false;
            return true;
          },
        };
      };
    },
  });
  const editor = useEditor({
    onUpdate({ editor }) {
      console.log(editor.getJSON());
      // onChange(editor.getHTML());
    },
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc" } },
        orderedList: {
          HTMLAttributes: { class: "list-decimal" },
        },
      }),
      Highlight,
      TaskList.configure(),
      TaskItem.configure({
        HTMLAttributes: { class: "flex gap-2" },
        nested: true,
      }),

      Underline,
      Table.configure({
        resizable: true,
      }),
      ImageExtension,
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: "💡Type @ to mention members.",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: {
          ...suggestion,
          items: (props: { query: string }) =>
            suggestion.items(props, members ?? []),
        },
      }),
    ],
    content: "",
  });

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = event.target.files?.[0];
        if (!file) return;

        const x = await uploadService.uploadFile(
          {
            type: TypeEnum.UserImage,
            file_name: file?.name || new Date().toString(),
            mimeType: file?.type,
          },
          file,
        );
        if (file && editor) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageDataUrl = e.target?.result as string;
            editor.chain().focus().setImage({ src: x }).run();
            // Move the cursor to the end of the document
            editor.commands.setTextSelection(editor.state.doc.content.size);
          };
          reader.readAsDataURL(file);
        }
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        toast.error("Failed to upload image");
      }
    },
    [editor],
  );
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const isContentEmpty = useCallback(() => {
    if (!editor) return true;
    const json = editor.getJSON();
    if (!json.content) return true;

    // Check if it's just an empty paragraph
    if (
      json.content.length === 1 &&
      json.content[0].type === "paragraph" &&
      json.content[0].content === undefined
    ) {
      return true;
    }

    // Check if there's any non-empty content (like images)
    const hasContent = json.content.some((node) => {
      // Check if it's an image or has any text content
      if (node.type === "image" || (node.content && node.content.length > 0)) {
        return true;
      }
      return false;
    });

    return !hasContent;
  }, [editor]);

  return (
    <div className="editor-box w-full min-w-full rounded-md border border-input bg-transparent px-3 py-2 ">
      <EditorContent
        className={cn(
          "flex text-primary h-20 prose-h1:text-4xl prose-h1:font-bold prose-h2:font-bold prose-h2:text-3xl  text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        )}
        editor={editor}
      />

      <div className=" flex items-center justify-between border border-input rounded shadow-sm bg-secondary/50 px-2 py-1">
        <div>
          {MarkItems.map((item) => (
            <Toggle
              key={item.id}
              onClick={() => {
                if (item.name === "listItem") {
                  editor?.commands.toggleBulletList();
                  return;
                }
                if (item.name === "orderedlist") {
                  editor?.commands.toggleOrderedList();
                  return;
                }
                if (item.name === "todolist") {
                  editor?.commands.toggleTaskList();
                  return;
                }
                if (item.name === "quote") {
                  editor?.commands.toggleBlockquote();
                  return;
                }
                if (item.name === "image") {
                  handleImageClick();
                  return;
                }
                if (item.name == "code") {
                  editor?.chain().focus().toggleCodeBlock().run();
                  return;
                }
                if (item.type == "node") {
                  editor
                    ?.chain()
                    .focus()
                    .toggleNode(item.name, "paragraph")
                    .run();
                  return;
                }
                editor?.chain().focus().toggleMark(item.name).run();
              }}
              value="bold"
              size="sm"
              aria-label="Toggle bold"
            >
              <item.icon className="h-4 w-4 text-primary/50" />
            </Toggle>
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          style={{ display: "none" }}
        />
        <Dialog
          open={!!enlargedImage}
          onOpenChange={() => setEnlargedImage(null)}
        >
          <DialogContent className="sm:max-w-[800px] m-0 p-0 border-0 rounded-3xl sm:max-h-[600px] flex items-center justify-center">
            {enlargedImage && (
              <img
                src={enlargedImage}
                alt="Enlarged view"
                className="max-w-full rounded-lg max-h-[calc(100vh-120px)] object-contain"
              />
            )}
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <Button
          disabled={isContentEmpty()}
          variant={"default"}
          size={"xs"}
          onClick={() => {
            handleSubmit(editor?.getHTML());
            editor?.commands.clearContent(true);
          }}
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentEditor;
