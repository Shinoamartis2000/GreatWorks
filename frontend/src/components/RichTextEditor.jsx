import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { api, buildFileUrl } from "@/lib/api";

const RichTextEditor = ({ value, onChange, dataTestId }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("files", file);
      formData.append("program_type", "CMS");
      const { data } = await api.post("/media/upload", formData);
      const uploaded = data.items?.[0]?.item;
      const imageUrl = buildFileUrl(uploaded?.optimized_url || uploaded?.original_url);
      editor?.chain().focus().setImage({ src: imageUrl }).run();
    };
  };

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-brand-forest/20 bg-white" data-testid={dataTestId}>
      <div className="flex flex-wrap gap-2 border-b border-brand-forest/10 p-2">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} data-testid="editor-bold" className="rounded px-2 py-1 text-xs text-brand-forest">
          Bold
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} data-testid="editor-italic" className="rounded px-2 py-1 text-xs text-brand-forest">
          Italic
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} data-testid="editor-bullet" className="rounded px-2 py-1 text-xs text-brand-forest">
          Bullet
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} data-testid="editor-ordered" className="rounded px-2 py-1 text-xs text-brand-forest">
          Ordered
        </button>
        <button type="button" onClick={handleImageUpload} data-testid="editor-image" className="rounded px-2 py-1 text-xs text-brand-forest">
          Image
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Paste link URL");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          data-testid="editor-link"
          className="rounded px-2 py-1 text-xs text-brand-forest"
        >
          Link
        </button>
        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} data-testid="editor-clear" className="rounded px-2 py-1 text-xs text-brand-forest">
          Clear
        </button>
      </div>
      <EditorContent editor={editor} className="min-h-[180px] p-4 text-sm text-brand-muted" />
    </div>
  );
};

export default RichTextEditor;
