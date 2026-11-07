import OrdersView from "@/components/admin/OrdersView";

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter } = await searchParams;
  return <OrdersView initialFilter={filter} />;
}
