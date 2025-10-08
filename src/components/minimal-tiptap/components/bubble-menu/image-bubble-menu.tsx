import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react";
import { ShouldShowProps } from "../../types";

const ImageBubbleMenu = ({ editor }: { editor: Editor }) => {
  const shouldShow = ({ editor, from, to }: ShouldShowProps) => {
    if (from === to) {
      return false;
    }

    const img = editor.getAttributes("image");

    if (img.src) {
      return true;
    }

    return false;
  };

  const unSetImage = () => {
    editor.commands.deleteSelection();
  };

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={shouldShow}
      tippyOptions={{
        placement: "bottom",
        offset: [0, 8],
      }}
    >
      <imgPopoverBlock onRemove={unSetImage} />
    </BubbleMenu>
  );
};

export { ImageBubbleMenu };
