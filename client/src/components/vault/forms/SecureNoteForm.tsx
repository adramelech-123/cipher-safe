import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Copy, Check, Loader, Eye, Shield, Type, AlignLeft, Bold, Italic, Code, List, Quote, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface SecureNoteFormProps {
  defaultValues?: Partial<{
    title: string;
    content: string;
    format: string;
    tags: string;
    isPinned: boolean;
    color: string;
  }>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

const formatOptions = [
  { value: "markdown", label: "Markdown", icon: Type },
  { value: "plaintext", label: "Plain Text", icon: AlignLeft },
];

const markdownToolbar = [
  { key: "bold", icon: Bold, prefix: "**", suffix: "**", tooltip: "Bold (Ctrl+B)" },
  { key: "italic", icon: Italic, prefix: "*", suffix: "*", tooltip: "Italic (Ctrl+I)" },
  { key: "code", icon: Code, prefix: "`", suffix: "`", tooltip: "Inline Code (Ctrl+`)" },
  { key: "codeBlock", icon: Code, prefix: "\n```\n", suffix: "\n```\n", tooltip: "Code Block" },
  { key: "list", icon: List, prefix: "- ", suffix: "", tooltip: "Bullet List" },
  { key: "quote", icon: Quote, prefix: "> ", suffix: "", tooltip: "Quote" },
  { key: "hr", icon: Minus, prefix: "\n---\n", suffix: "", tooltip: "Horizontal Rule" },
];

const SecureNoteForm = ({ defaultValues, onSubmit, isLoading, onCancel }: SecureNoteFormProps) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
      format: "markdown",
      tags: "",
      isPinned: false,
      color: "#8b5cf6",
      ...defaultValues,
    },
  });

  const content = watch("content");
  const format = watch("format");
  const contentRegistration = register("content", { required: "Content is required" });
  const { ref: contentRegisterRef, ...contentFields } = contentRegistration;

  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(content.length);
  }, [content]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Content copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const insertMarkdown = (prefix: string, suffix: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);

    setValue("content", newText, { shouldValidate: true });

    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
      } else {
        textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      }
    }, 0);
  };

  const handleSubmitForm = async (data: Record<string, unknown>) => {
    const tags = data.tags ? String(data.tags).split(",").map((t) => t.trim()).filter(Boolean) : [];
    await onSubmit({
      ...data,
      tags,
      isPinned: data.isPinned || false,
    });
  };

  const renderMarkdown = (md: string): string => {
    return md
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/gim, "<em>$1</em>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/\n/gim, "<br>")
      .replace(/---/gim, "<hr>");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(handleSubmitForm)}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="e.g., Server Config, Recovery Codes, Meeting Notes"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
            error={!!errors.title}
          />
          {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <Label htmlFor="format">Format</Label>
          <div className="flex gap-2">
            {formatOptions.map((opt) => (
              <Button
                key={opt.value}
                type="button"
                variant={format === opt.value ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex items-center gap-1",
                  format === opt.value ? "bg-violet-600 text-white" : "bg-white/5 border-white/20 text-slate-300"
                )}
                onClick={() => setValue("format", opt.value)}
              >
                <opt.icon size={14} />
                <span>{opt.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="color">Color Tag</Label>
          <Input
            id="color"
            type="color"
            {...register("color")}
            className="w-12 h-12 rounded-lg border-white/20 bg-white/5 cursor-pointer"
            title="Pick a color for this note"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="content">Content {format === "markdown" && !previewMode && <span className="text-xs text-slate-400">(Markdown)</span>}</Label>
          <div className="flex items-center gap-1">
            {format === "markdown" && !previewMode && (
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg border border-white/10">
                {markdownToolbar.map((tool) => (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => insertMarkdown(tool.prefix, tool.suffix)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    title={tool.tooltip}
                  >
                    <tool.icon size={14} />
                  </button>
                ))}
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              className={cn(
                "text-slate-300 hover:text-white",
                previewMode && "text-violet-400"
              )}
            >
              {previewMode ? <Type size={16} /> : <Eye size={16} />}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!content || copied}
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {previewMode && format === "markdown" ? (
          <div
            className="prose prose-invert max-w-none bg-white/5 border border-white/10 rounded-xl p-4 min-h-[200px] text-slate-100"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        ) : (
          <Textarea
            id="content"
            ref={(el) => {
              contentRef.current = el;
              contentRegisterRef(el);
            }}
            {...contentFields}
            placeholder={format === "markdown"
              ? "# Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2\n\n```code block```"
              : "Enter your secure note content..."}
            className="bg-white/5 border-white/20 text-white placeholder-slate-500 font-mono text-sm min-h-[200px] resize-y"
            rows={12}
            spellCheck={false}
          />
        )}
        {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>}

        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <span>{wordCount} words · {charCount} characters</span>
          {format === "markdown" && (
            <span className="flex items-center gap-1">
              <Type size={12} /> Markdown
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            {...register("tags")}
            placeholder="important, reference, config"
            className="bg-white/5 border-white/20 text-white placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <Label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isPinned")}
              className="w-4 h-4 rounded border-white/30 text-violet-500 focus:ring-violet-500"
            />
            <span className="text-slate-300">Pin to top</span>
          </Label>
        </div>
      </div>

      <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-center gap-2 text-purple-400 mb-2">
          <Shield size={16} />
          <span className="font-medium">Encryption & Privacy</span>
        </div>
        <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
          <li>Note content is encrypted locally with AES-256-GCM</li>
          <li>Encryption key derived from your login password (PBKDF2)</li>
          <li>Zero-knowledge architecture - we cannot read your notes</li>
          <li>Markdown formatting rendered client-side only</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-white/10">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700">
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2" size={18} />
              Saving...
            </>
          ) : defaultValues?.title ? (
            "Update Note"
          ) : (
            "Save Note"
          )}
        </Button>
      </div>
    </motion.form>
  );
};

export default SecureNoteForm;