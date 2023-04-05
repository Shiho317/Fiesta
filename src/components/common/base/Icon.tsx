import React from "react";
import * as OutlineIcons from "@heroicons/react/24/outline";
import * as SolidIcons from "@heroicons/react/24/solid";

type OutlineIconName = keyof typeof OutlineIcons;
type SolidIconName = keyof typeof SolidIcons;

type OutlineIconProp = {
  icon: OutlineIconName;
  className?: string;
};

type SolidIconProp = {
  icon: SolidIconName;
  className: string;
};

export const OutlineIcon = (props: OutlineIconProp) => {
  const { icon, className } = props;
  const Outline = OutlineIcons[icon];

  return <Outline className={className ?? ""} />;
};

export const SolidIcon = (props: SolidIconProp) => {
  const { icon, className } = props;
  const Solid = SolidIcons[icon];

  return <Solid className={className ?? ""} />;
};
