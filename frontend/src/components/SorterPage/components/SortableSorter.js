import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableSorter = ({ sorter, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `sorter-${sorter.sorter_id}`, // 고유 ID로 명확히 지정
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="sorter-wrapper"
    >
      {children}
    </div>
  );
};

export default SortableSorter;
