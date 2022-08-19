import { Plugin } from "../generate";

export const handleComment: Plugin = {
  before({ element, stop }) {
    if (element.type === "comment") {
      element.type = "text";
      element.text = `{/* ${element.comment} */}`;
      delete element.comment;
      return stop();
    }
  }
};
