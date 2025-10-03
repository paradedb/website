interface AvatarFallbackProps {
  name: string;
  className?: string;
}

// Color palette for avatars - good contrast and accessibility
const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

function getColorForName(name: string): string {
  // Simple hash function to consistently assign colors based on name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2); // Max 2 letters
}

export function AvatarFallback({
  name,
  className = "h-7 w-7",
}: AvatarFallbackProps) {
  const initials = getInitials(name);
  const colorClass = getColorForName(name);

  return (
    <div
      className={`${className} ${colorClass} rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm`}
    >
      {initials}
    </div>
  );
}
