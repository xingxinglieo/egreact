import { Link, LinkProps } from "react-router-dom";
import { TransProp, Setters } from "egreact";
import React from "react";

export const EgreactLink: React.ForwardRefExoticComponent<
  TransProp<typeof Setters.eui.label> & LinkProps
> = Link as any;
