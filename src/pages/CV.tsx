import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CV() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
      {/* Toolbar */}
      <motion.div
        className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm shrink-0"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </motion.div>

        <span className="text-sm font-medium text-muted-foreground">CV</span>

        <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
          <Button size="sm" asChild className="gap-2">
            <a href="/files/cv.pdf" download="Nick_Palade_CV.pdf">
              <Download className="h-4 w-4" />
              Download
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* PDF viewer */}
      <motion.iframe
        src="/files/cv.pdf"
        className="flex-1 w-full border-0"
        title="CV"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      />
    </div>
  );
}
