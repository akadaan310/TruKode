import { redirect } from "next/navigation";

/* The Reads listing is now the full Products catalog at /products.
   Individual Read detail pages remain at /reads/<slug>. */
export default function ReadsIndexRedirect() {
  redirect("/products");
}
