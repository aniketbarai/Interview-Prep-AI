import React, { useState } from "react";

// Icons
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";

// Markdown renderer
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Code highlighter
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

// =====================================================
// MAIN COMPONENT
// =====================================================
const AIResponsePreview = ({ content }) => {
  // fallback UI when no content
  if (!content) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-xl">
        <p className="text-yellow-700 text-sm">
          AI response is loading or not available.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      
      {/* Markdown wrapper */}
      <div className="text-[14px] sm:text-[15px] prose prose-slate max-w-none break-words">

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{

            // CODE HANDLER
            code({ className, children }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className;

              if (isInline) {
                return (
                  <code className="px-1 py-0.5 bg-gray-100 rounded text-pink-600 text-sm break-words">
                    {children}
                  </code>
                );
              }

              return (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={language}
                />
              );
            },

            // PARAGRAPH (mobile safe)
            p({ children }) {
              return (
                <p className="mb-3 leading-7 text-gray-700 break-words">
                  {children}
                </p>
              );
            },

            strong({ children }) {
              return <strong className="font-semibold text-black">{children}</strong>;
            },

            em({ children }) {
              return <em className="italic text-gray-700">{children}</em>;
            },

            ul({ children }) {
              return <ul className="list-disc pl-5 my-3 space-y-2">{children}</ul>;
            },

            ol({ children }) {
              return <ol className="list-decimal pl-5 my-3 space-y-2">{children}</ol>;
            },

            li({ children }) {
              return <li className="text-gray-700 leading-7">{children}</li>;
            },

            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-4 rounded-r-lg text-gray-700">
                  {children}
                </blockquote>
              );
            },

            // HEADINGS (responsive scaling)
            h1({ children }) {
              return (
                <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4">
                  {children}
                </h1>
              );
            },

            h2({ children }) {
              return (
                <h2 className="text-xl sm:text-2xl font-bold mt-5 mb-3">
                  {children}
                </h2>
              );
            },

            h3({ children }) {
              return (
                <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2">
                  {children}
                </h3>
              );
            },

            // LINKS
            a({ children, href }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {children}
                </a>
              );
            },

            // TABLE (mobile scroll safe)
            table({ children }) {
              return (
                <div className="overflow-x-auto my-4 border rounded-lg">
                  <table className="min-w-full">{children}</table>
                </div>
              );
            },

            img({ src, alt }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg my-4"
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>

      </div>
    </div>
  );
};

// =====================================================
// CODE BLOCK COMPONENT
// =====================================================
function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 border rounded-xl overflow-hidden bg-white w-full max-w-full">
      
      {/* top bar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-gray-50">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <LuCode />
          <span className="uppercase text-gray-600">
            {language || "code"}
          </span>
        </div>

        <button onClick={copyCode} className="text-gray-600 hover:text-black">
          {copied ? (
            <LuCheck className="text-green-600" />
          ) : (
            <LuCopy />
          )}
        </button>
      </div>

      {/* code area (mobile scroll fix) */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneLight}
          customStyle={{
            fontSize: 13,
            margin: 0,
            padding: "12px",
            background: "transparent",
            width: "100%",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

export default AIResponsePreview;