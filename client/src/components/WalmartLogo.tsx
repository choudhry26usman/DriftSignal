import walmartLogoUrl from "@assets/image_1764352763484.png";

interface WalmartLogoProps {
  className?: string;
}

export function WalmartLogo({ className = "h-5 w-5" }: WalmartLogoProps) {
  return (
    <img 
      src={walmartLogoUrl} 
      alt="Walmart" 
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
}
