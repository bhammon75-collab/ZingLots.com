type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  sizes?: string; // e.g., "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
};

export default function SmartImage({ sizes = "100vw", ...props }: SmartImageProps) {
  return (
    <img
      loading="lazy"
      sizes={sizes}
      {...props}
    />
  );
}