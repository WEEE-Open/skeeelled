import React from "react";
import { MarkdownUtil } from "@sahircansurmeli/react-mde";

const insertTex = {
  name: "insert-tex",
  icon: () => (
    <img
      src={process.env.PUBLIC_URL + "/icons/TeX_logo.svg"}
      width="26"
      height="15"
      alt="Insert TeX"
    />
  ),
  buttonProps: {
    "aria-label": "Add TeX",
    title: "Add TeX",
  },
  execute: ({ textApi, initialState }) => {
    const newSelectionRange = MarkdownUtil.selectWord({
      text: initialState.text,
      selection: initialState.selection,
    });

    const state1 = textApi.setSelectionRange(newSelectionRange);

    const s1 = state1.selection;
    const text = state1.text;
    const selectedText = state1.selectedText;
    let state2;

    if (
      selectedText.substring(0, 1) === "$" &&
      selectedText.substring(selectedText.length - 1, selectedText.length) ===
        "$"
    ) {
      state2 = textApi.replaceSelection(
        selectedText.substring(1, selectedText.length - 1)
      );
      textApi.setSelectionRange({
        start: s1.start,
        end: s1.end - 1,
      });
    } else if (
      s1.start >= 1 &&
      text.substring(s1.start - 1, s1.start) === "$" &&
      text.substring(s1.end, s1.end + 1) === "$"
    ) {
      textApi.setSelectionRange({
        start: s1.start - 1,
        end: s1.end + 1,
      });
      state2 = textApi.replaceSelection(state1.selectedText);
      textApi.setSelectionRange({
        start: state2.selection.start - state1.selectedText.length,
        end: state2.selection.end,
      });
    } else {
      // Replaces the current selection with the italic mark up
      state2 = textApi.replaceSelection(`$${state1.selectedText}$`);
      // Adjust the selection to not contain the *
      textApi.setSelectionRange({
        start: state2.selection.end - 1 - state1.selectedText.length,
        end: state2.selection.end - 1,
      });
    }
  }
};

export default insertTex;