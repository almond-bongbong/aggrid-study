import GridTable from '@/app/component/grid-table';

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">AG Grid Study</h1>

      <GridTable />
    </div>
  );
}
