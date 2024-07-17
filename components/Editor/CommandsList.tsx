// @ts-nocheck
import React, { Component } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

class CommandList extends Component {
  state = {
    selectedIndex: 0,
  };

  componentDidUpdate(oldProps) {
    if (this.props.items !== oldProps.items) {
      this.setState({
        selectedIndex: 0,
      });
    }
  }

  onKeyDown({ event }) {
    if (event.key === "ArrowUp") {
      this.upHandler();
      return true;
    }

    if (event.key === "ArrowDown") {
      this.downHandler();
      return true;
    }

    if (event.key === "Enter") {
      this.enterHandler();
      return true;
    }

    return false;
  }

  upHandler() {
    this.setState({
      selectedIndex:
        (this.state.selectedIndex + this.props.items.length - 1) %
        this.props.items.length,
    });
  }

  downHandler() {
    this.setState({
      selectedIndex: (this.state.selectedIndex + 1) % this.props.items.length,
    });
  }

  enterHandler() {
    this.selectItem(this.state.selectedIndex);
  }

  selectItem(index) {
    const item = this.props.items[index];

    if (item) {
      this.props.command(item);
    }
  }

  render() {
    const { items } = this.props;

    return (
      <div
        id="slash-command"
        // ref={commandListContainer}
        className="z-10 max-h-80 min-w-[12rem] overflow-y-auto rounded-md border-[0.5px] border-secondary bg-popover px-2 py-2.5 shadow-lg"
      >
        {items.map((item, index) => (
          <button
            key={item.key}
            className={cn(
              "flex items-center  gap-2 w-full rounded px-1 py-1.5 text-sm text-left truncate hover:bg-secondary",
              {
                "bg-secondary": index === this.state.selectedIndex,
              }
            )}
            onClick={(e) => {
              e.stopPropagation();
              this.enterHandler();
            }}
          >
            <span className="grid place-items-center flex-shrink-0">
              {/* {item.icon} */}
            </span>
            <p className="flex-grow truncate">{item.title}</p>
          </button>
        ))}
      </div>
    );
  }
}

export default CommandList;
