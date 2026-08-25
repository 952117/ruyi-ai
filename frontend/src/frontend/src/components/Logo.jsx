export default function Logo() {
  return (
    <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto mb-4 drop-shadow-lg">
      <path d="M 30 45 C 30 35 40 25 50 25 C 60 25 70 35 70 45 C 70 55 60 65 50 65 C 40 65 30 55 30 45 Z" fill="#3b3c8f" />
      <path d="M 50 65 C 50 75 50 85 50 90" stroke="#3b3c8f" strokeWidth="8" strokeLinecap="round" />
      <path d="M 40 80 C 30 85 20 85 15 80" stroke="#3b3c8f" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M 60 80 C 70 85 80 85 85 80" stroke="#3b3c8f" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="42" cy="40" r="8" fill="white" />
      <circle cx="58" cy="40" r="8" fill="white" />
      <path d="M 46 32 A 10 10 0 0 1 42 40" stroke="#3b3c8f" strokeWidth="4" fill="none" />
      <path d="M 54 32 A 10 10 0 0 0 58 40" stroke="#3b3c8f" strokeWidth="4" fill="none" />
    </svg>
  )
}
