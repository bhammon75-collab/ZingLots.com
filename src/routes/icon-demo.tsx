import CategoryIcon, { type CategoryIconName } from "@/components/CategoryIcon";

const ICONS: CategoryIconName[] = [
  "anvil",
  "cutlery",
  "shirt",
  "bulldozer",
  "briefcase",
  "dumbbells",
  "sofa",
  "flask",
  "ring",
  "wrench",
];

const IconDemo = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Category Icons Demo</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {ICONS.map((name) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div className="aspect-square w-24 flex items-center justify-center rounded-md border bg-white">
              <CategoryIcon name={name} className="h-20 w-20" />
            </div>
            <div className="text-sm text-muted-foreground">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconDemo;

