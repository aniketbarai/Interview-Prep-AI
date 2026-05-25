import React, { useState } from "react";

// =====================================================
// ICONS
// =====================================================
import {
  LuCopy,
  LuCheck,
  LuCode,
} from "react-icons/lu";

// =====================================================
// MARKDOWN RENDERER
// ReactMarkdown -> renders markdown as HTML
// remarkGfm -> enables GitHub markdown features
// =====================================================
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// =====================================================
// CODE SYNTAX HIGHLIGHTER
// =====================================================
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { oneLight } from
  "react-syntax-highlighter/dist/esm/styles/prism";

// =====================================================
// AI RESPONSE PREVIEW COMPONENT
// Renders markdown response from AI
// =====================================================
const AIResponsePreview = ({ content }) => {

  // ===================================================
  // IF NO CONTENT AVAILABLE
  // ===================================================
  if (!content) {

    return (

      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-xl shadow-sm">

        <p className="text-yellow-700 text-sm leading-relaxed">

          The AI response is being formatted.
          If this takes too long,
          please regenerate the explanation.

        </p>

      </div>
    );
  }

  // ===================================================
  // MAIN UI
  // ===================================================
  return (

    <div className="max-w-4xl mx-auto">

      {/* ===============================================
          PROSE -> typography styles
      =============================================== */}
      <div className="text-[14px] prose prose-slate max-w-none">

        <ReactMarkdown

          // Enable tables, tasklists, strikethrough etc
          remarkPlugins={[remarkGfm]}

          // ===========================================
          // CUSTOM COMPONENT RENDERERS
          // ===========================================
          components={{

            // =========================================
            // CODE BLOCKS
            // =========================================
            code({
              className,
              children,
              ...props
            }) {

              // Extract language from markdown
              // Example:
              // ```js
              // becomes language-js
              const match =
                /language-(\w+)/.exec(
                  className || ""
                );

              const language =
                match
                  ? match[1]
                  : "";

              // Inline code check
              const isInline =
                !className;

              // =====================================
              // MULTI-LINE CODE BLOCK
              // =====================================
              return !isInline ? (

                <CodeBlock
                  code={String(children)
                    .replace(/\n$/, "")}

                  language={language}
                />

              ) : (

                // ===================================
                // INLINE CODE
                // Example: `npm install`
                // ===================================
                <code
                  className="px-1.5 py-0.5 bg-gray-100 rounded text-sm text-pink-600 font-medium"

                  {...props}
                >
                  {children}
                </code>
              );
            },

            // =========================================
            // PARAGRAPH
            // =========================================
            p({ children }) {

              return (
                <p className="mb-4 leading-7 text-gray-700">

                  {children}

                </p>
              );
            },

            // =========================================
            // BOLD TEXT
            // =========================================
            strong({ children }) {

              return (
                <strong className="font-bold text-black">

                  {children}

                </strong>
              );
            },

            // =========================================
            // ITALIC TEXT
            // =========================================
            em({ children }) {

              return (
                <em className="italic text-gray-700">

                  {children}

                </em>
              );
            },

            // =========================================
            // UNORDERED LIST
            // =========================================
            ul({ children }) {

              return (
                <ul className="list-disc pl-6 space-y-2 my-4">

                  {children}

                </ul>
              );
            },

            // =========================================
            // ORDERED LIST
            // =========================================
            ol({ children }) {

              return (
                <ol className="list-decimal pl-6 space-y-2 my-4">

                  {children}

                </ol>
              );
            },

            // =========================================
            // LIST ITEM
            // =========================================
            li({ children }) {

              return (
                <li className="leading-7 text-gray-700">

                  {children}

                </li>
              );
            },

            // =========================================
            // BLOCKQUOTE
            // =========================================
            blockquote({ children }) {

              return (

                <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 italic my-5 rounded-r-lg text-gray-700">

                  {children}

                </blockquote>
              );
            },

            // =========================================
            // HEADINGS
            // =========================================
            h1({ children }) {

              return (
                <h1 className="text-3xl font-bold mt-8 mb-5 text-black">

                  {children}

                </h1>
              );
            },

            h2({ children }) {

              return (
                <h2 className="text-2xl font-bold mt-7 mb-4 text-black">

                  {children}

                </h2>
              );
            },

            h3({ children }) {

              return (
                <h3 className="text-xl font-semibold mt-6 mb-3 text-black">

                  {children}

                </h3>
              );
            },

            h4({ children }) {

              return (
                <h4 className="text-lg font-semibold mt-5 mb-2 text-black">

                  {children}

                </h4>
              );
            },

            // =========================================
            // LINKS
            // =========================================
            a({ children, href }) {

              return (

                <a
                  href={href}

                  target="_blank"

                  rel="noopener noreferrer"

                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >

                  {children}

                </a>
              );
            },

            // =========================================
            // TABLE
            // =========================================
            table({ children }) {

              return (

                <div className="overflow-x-auto my-5 border border-gray-200 rounded-xl">

                  <table className="min-w-full">

                    {children}

                  </table>

                </div>
              );
            },

            thead({ children }) {

              return (
                <thead className="bg-gray-100">

                  {children}

                </thead>
              );
            },

            tbody({ children }) {

              return (
                <tbody className="divide-y divide-gray-200">

                  {children}

                </tbody>
              );
            },

            tr({ children }) {

              return (
                <tr className="hover:bg-gray-50 transition-colors">

                  {children}

                </tr>
              );
            },

            th({ children }) {

              return (
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-600">

                  {children}

                </th>
              );
            },

            td({ children }) {

              return (
                <td className="px-4 py-3 text-sm text-gray-700">

                  {children}

                </td>
              );
            },

            // =========================================
            // HORIZONTAL LINE
            // =========================================
            hr() {

              return (
                <hr className="my-8 border-gray-200" />
              );
            },

            // =========================================
            // IMAGE
            // =========================================
            img({ src, alt }) {

              return (

                <img
                  src={src}
                  alt={alt}

                  className="my-5 rounded-xl shadow-md max-w-full"
                />
              );
            },
          }}
        >

          {/* Markdown Content */}
          {content}

        </ReactMarkdown>

      </div>
    </div>
  );
};

// =====================================================
// CODE BLOCK COMPONENT
// Shows:
// - Syntax highlighting
// - Copy button
// - Language label
// =====================================================
function CodeBlock({
  code,
  language,
}) {

  // Copy state
  const [copied, setCopied] =
    useState(false);

  // ===================================================
  // COPY CODE FUNCTION
  // ===================================================
  const copyCode = () => {

    navigator.clipboard.writeText(code);

    setCopied(true);

    // Reset after 2 seconds
    setTimeout(() => {

      setCopied(false);

    }, 2000);
  };

  return (

    <div className="relative my-6 border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white">

      {/* ===============================================
          TOP BAR
      =============================================== */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-2">

          <LuCode
            size={16}
            className="text-gray-500"
          />

          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">

            {language || "Code"}

          </span>

        </div>

        {/* COPY BUTTON */}
        <button
          onClick={copyCode}

          className="text-gray-500 hover:text-black transition-colors relative"

          aria-label="Copy code"
        >

          {copied ? (

            <LuCheck
              size={17}
              className="text-green-600"
            />

          ) : (

            <LuCopy size={17} />

          )}
        </button>
      </div>

      {/* ===============================================
          CODE HIGHLIGHTER
      =============================================== */}
      <SyntaxHighlighter

        language={language}

        style={oneLight}

        customStyle={{
          fontSize: 13,
          margin: 0,
          padding: "1rem",
          background: "transparent",
        }}
      >

        {code}

      </SyntaxHighlighter>

    </div>
  );
}

export default AIResponsePreview;