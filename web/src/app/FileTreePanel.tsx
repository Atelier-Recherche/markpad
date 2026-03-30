type FileTreePanelProps = {
  title: string;
  paths: string[];
  activePath: string | null;
  onSelect: (path: string) => void;
};

const pathParts = (path: string): string[] => path.split("/").filter(Boolean);

export const FileTreePanel = ({
  title,
  paths,
  activePath,
  onSelect
}: FileTreePanelProps) => {
  const sorted = [...paths].sort((a, b) => a.localeCompare(b));

  return (
    <aside className="file-tree-panel">
      <h3 className="file-tree-panel__title">{title}</h3>
      <ul className="file-tree-panel__list">
        {sorted.map((path) => {
          const label = pathParts(path).pop() ?? path;
          const isActive = path === activePath;
          return (
            <li key={path}>
              <button
                type="button"
                className={`file-tree-panel__item${isActive ? " file-tree-panel__item--active" : ""}`}
                onClick={() => onSelect(path)}
              >
                <span className="file-tree-panel__name">{label}</span>
                <span className="file-tree-panel__path" title={path}>
                  {path}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
