import Image from "next/image";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function Photo({ src, alt, className, sizes = "100vw", priority }: PhotoProps) {
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={className} />;
}
