import { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import { memo } from "react";

interface IconProps extends LucideProps {
  name: string;
}

const DynamicIcon = memo(({ name, ...props }: IconProps) => {
  if (!(name in dynamicIconImports)) {
    return null;
  }

  const LucideIcon = dynamic(
    dynamicIconImports[name as keyof typeof dynamicIconImports],
  );

  return <LucideIcon {...props} />;
});

DynamicIcon.displayName = "DynamicIcon";

export default DynamicIcon;
