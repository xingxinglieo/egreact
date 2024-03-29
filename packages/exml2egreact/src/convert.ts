import { generate, CollectInfo } from "./generate";
import { convert } from "xml-js-convert";
import {
  handleTag,
  handlePropTag,
  handleComment,
  handleConditionProps,
  handleSpecialProps,
  handleNativeValue,
  handleSkin,
  handleVariable,
  htmlDecode,
  handleScroller
} from "./plugins";

export default function (exml: string) {
  const info = new CollectInfo();
  const jsx = convert(exml, {
    info,
    plugins: [
      handleVariable,
      handleSkin,
      handleScroller,
      handleTag,
      handlePropTag,
      handleComment,
      handleConditionProps,
      handleSpecialProps,
      handleNativeValue,
      htmlDecode
    ]
  });
  return generate(jsx, info);
}
