export function Logo() {
  return (
    <div className="flex items-center justify-center -space-x-1">
        <svg
            className="h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C20.7 10.4 21 10.2 21 9.5v-2a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 5 7.5v2c0 .7.3 1.1.5 1.4-.8.2-1.5 1-1.5 1.9v3c0 .6.4 1 1 1h2"/>
            <path d="M10 17h4"/>
            <path d="M6 11h12"/>
            <path d="M7.5 17a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 0 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>
      <span className="text-xl font-bold tracking-tighter text-foreground">
        Auto Charter
      </span>
    </div>
  );
}
