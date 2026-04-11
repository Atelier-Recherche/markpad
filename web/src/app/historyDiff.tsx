import { diffChars } from "diff";

type Props = {
  snapshot: string;
  current: string;
};

/**
 * Affiche le texte du snapshot avec surbrillance des segments absents du document actuel
 * (diff caractère à caractère, premier = snapshot, second = courant).
 */
export const HistoryDiffBody = ({ snapshot, current }: Props) => {
  const parts = diffChars(snapshot, current);
  return (
    <div className="history-panel__diff">
      {parts.map((part, i) => {
        if (part.added) return null;
        return (
          <span key={i} className={part.removed ? "history-panel__diff-removed" : undefined}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
};
