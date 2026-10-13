import { requireAdmin } from "@/lib/admin";
import { listMedia } from "@/lib/media";
import { MediaLibrary } from "@/components/admin/media-library";
export default async function MediaPage() {
  await requireAdmin();
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">RECURSOS VISUAIS</span>
          <h1>Sua biblioteca.</h1>
          <p>Imagens para dar forma às suas publicações.</p>
        </div>
      </div>
      <section className="admin-panel padded-panel">
        <MediaLibrary initial={await listMedia()} />
      </section>
      <p className="admin-note">
        Imagens só ficam públicas quando usadas em um artigo publicado. Arquivos
        privados exigem sua sessão administrativa.
      </p>
    </>
  );
}
