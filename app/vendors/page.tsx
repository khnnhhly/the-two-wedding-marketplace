import { VendorsClient } from "./VendorsClient";

type Search = Promise<Record<string, string | string[] | undefined>>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function VendorsPage({ searchParams }: { searchParams: Search }) {
  const params = await searchParams;
  return <VendorsClient initial={{ q: one(params.q), category: one(params.category), location: one(params.location), price: one(params.price), recommended: one(params.recommended) === "1" }}/>;
}
