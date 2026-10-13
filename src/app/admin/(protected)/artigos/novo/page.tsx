import { requireAdmin } from "@/lib/admin";
import { listMedia } from "@/lib/media";
import { Editor } from "@/components/admin/editor";
export default async function NewArticle() {
  await requireAdmin();
  return <Editor media={await listMedia()} />;
}
