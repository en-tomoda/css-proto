/* eslint-disable @next/next/no-img-element */
export function EnLogo({ className }: { className?: string }) {
  return <img src="/en-logo-trimmed.png" alt="en" className={className} />;
}

export function TaLogo({ className }: { className?: string }) {
  return (
    <img src="/ta-logo-trimmed.png" alt="TALENT ANALYTICS" className={className} />
  );
}
