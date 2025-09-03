type SmartImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt"> & {
  sizes?: string; // e.g., "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
  alt?: string;
};

export default function SmartImage({ sizes = "100vw", alt = "", ...props }: SmartImageProps) {
  return (
    <img
      loading="lazy"
      sizes={sizes}
      alt={alt ?? ""}
      {...props}
    />
  );
}