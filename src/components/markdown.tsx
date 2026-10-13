import ReactMarkdown from "react-markdown";
import Image from "next/image";
import remarkGfm from "remark-gfm";
export function Markdown({ content }: { content: string }) {
  return (
    <div className="article-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={(url, key) => {
          if (key === "src")
            return /^\/media\/[a-f0-9-]{36}$/.test(url) ? url : "";
          return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url) ? url : "";
        }}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href, children }) => (
            <a href={href} rel="noopener noreferrer">
              {children}
            </a>
          ),
          img: ({ src, alt }) =>
            typeof src === "string" && src ? (
              <Image src={src} alt={alt || ""} width={1200} height={750} sizes="(max-width: 760px) 100vw, 760px" />
            ) : null,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
