import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  KeyboardEvent,
} from "react";

interface MentionListProps {
  items: string[];
  command: (item: { id: string }) => void;
}

interface MentionListRef {
  onKeyDown: (event: { event: KeyboardEvent }) => boolean;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(
  (props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: item });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length,
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => {
      setSelectedIndex(0);
    }, [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.key === "Enter") {
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="bg-primary-foreground text-primary border rounded-lg shadow-md flex flex-col gap-1 overflow-auto p-2">
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              className={`flex items-center w-full gap-1 rounded-sm px-2 text-left transition-colors ${
                index === selectedIndex ? "bg-primary/10" : "bg-transparent"
              } hover:bg-primary/30`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </button>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </div>
    );
  },
);

MentionList.displayName = "MentionList";

export default MentionList;
