type FileTreePanelProps = {
  title: string;
  paths: string[];
  activePath: string | null;
  /** Préfixe du dossier partagé (chemin vault) : les libellés sont affichés en relatif. */
  rootPrefix?: string;
  onSelect: (path: string) => void;
};

const pathParts = (path: string): string[] => path.split("/").filter(Boolean);

/** Affiche un chemin relatif au dossier partagé ; sinon le nom de fichier seul. */
const labelRelativeToRoot = (full: string, root: string | undefined): string => {
  const f = full.replace(/\\/g, "/");
  if (!root?.trim()) {
    return pathParts(f).pop() ?? f;
  }
  const r = root.replace(/\\/g, "/").replace(/\/$/, "");
  if (f === r) {
    return pathParts(f).pop() ?? f;
  }
  const prefix = `${r}/`;
  if (f.startsWith(prefix)) {
    return f.slice(prefix.length);
  }
  return pathParts(f).pop() ?? f;
};

export const FileTreePanel = ({
  title,
  paths,
  activePath,
  rootPrefix,
  onSelect
}: FileTreePanelProps) => {
  const sorted = [...paths].sort((a, b) => a.localeCompare(b));

  return (
    <aside className="file-tree-panel">
      <h3 className="file-tree-panel__title">{title}</h3>
      <ul className="file-tree-panel__list">
        {sorted.map((path) => {
          const label = labelRelativeToRoot(path, rootPrefix);
          const isActive = path === activePath;
          return (
            <li key={path}>
              <button
                type="button"
                className={`file-tree-panel__item${isActive ? " file-tree-panel__item--active" : ""}`}
                title={path}
                onClick={() => onSelect(path)}
              >
                <span className="file-tree-panel__name">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
