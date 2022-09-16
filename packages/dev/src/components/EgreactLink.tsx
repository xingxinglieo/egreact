import { Setters, TransProp } from "egreact";
import { Link, LinkProps } from "react-router-dom";

export const EgreactLink: React.ForwardRefExoticComponent<
  TransProp<typeof Setters.eui.label> & LinkProps
> = Link as any;
