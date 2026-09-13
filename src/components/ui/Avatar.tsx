import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
  xl: "w-20 h-20",
};

const textSizeClasses: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-xl",
};

export function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const sizeClass = sizeClasses[size];
  const textClass = textSizeClasses[size];

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-primary/10 flex items-center justify-center ${sizeClass} ${className}`}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes="80px" />
      ) : (
        <span className={`font-semibold text-primary ${textClass}`}>
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
