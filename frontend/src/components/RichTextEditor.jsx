import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api, buildFileUrl } from "@/lib/api";

const RichTextEditor = ({ value, onChange, dataTestId }) => {
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: () => {
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
              const quill = quillRef.current?.getEditor();
              const range = quill?.getSelection(true);
              quill?.insertEmbed(range?.index || 0, "image", imageUrl);
            };
          },
        },
      },
    }),
    []
  );

  return (
    <div data-testid={dataTestId}>
      <ReactQuill ref={quillRef} theme="snow" value={value} onChange={onChange} modules={modules} />
    </div>
  );
};

export default RichTextEditor;
