import { WorkflowBoard } from '../WorkflowBoard';

export default function WorkflowBoardExample() {
  const mockColumns = [
    {
      id: "open",
      title: "Open",
      reviews: [
        {
          id: "1",
          marketplace: "Amazon" as const,
          title: "Product damaged",
          severity: "high",
          category: "defect",
        },
      ],
    },
    {
      id: "in_progress",
      title: "In Progress",
      reviews: [
        {
          id: "2",
          marketplace: "eBay" as const,
          title: "Slow shipping",
          severity: "medium",
          category: "shipping",
        },
      ],
    },
    {
      id: "resolved",
      title: "Resolved",
      reviews: [],
    },
  ];

  return (
    <div className="p-6">
      <WorkflowBoard 
        columns={mockColumns} 
        onReviewMove={(id, from, to) => console.log(`Moved ${id} from ${from} to ${to}`)}
      />
    </div>
  );
}
