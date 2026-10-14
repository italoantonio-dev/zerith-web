import { requireAdmin } from "@/lib/admin";
import { listProducts } from "@/lib/products";
import { ProductManager } from "@/components/admin/product-manager";
import { listMedia } from "@/lib/media";
export default async function AdminProductsPage() { await requireAdmin(); return <ProductManager initial={await listProducts(true)} media={await listMedia()} />; }
