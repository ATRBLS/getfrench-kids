export default function Rocky({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="36" fill="#9ca3af"/>
      <ellipse cx="40" cy="35" rx="22" ry="10" fill="#1e1b4b"/>
      <circle cx="32" cy="33" r="6" fill="white"/>
      <circle cx="48" cy="33" r="6" fill="white"/>
      <circle cx="33" cy="33" r="3" fill="#1e1b4b"/>
      <circle cx="49" cy="33" r="3" fill="#1e1b4b"/>
      <circle cx="34" cy="32" r="1" fill="white"/>
      <circle cx="50" cy="32" r="1" fill="white"/>
      <ellipse cx="40" cy="44" rx="4" ry="3" fill="#ef4444"/>
      <path d="M33 50 Q40 56 47 50" stroke="#1e1b4b" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="18" cy="18" r="10" fill="#9ca3af"/>
      <circle cx="62" cy="18" r="10" fill="#9ca3af"/>
      <circle cx="18" cy="18" r="5" fill="#f9a8d4"/>
      <circle cx="62" cy="18" r="5" fill="#f9a8d4"/>
    </svg>
  );
}
