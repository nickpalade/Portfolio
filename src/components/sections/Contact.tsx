import { useRef } from "react";
import { Mail, Github, Linkedin, FileText } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10% 0px" });

  return (
    <section id="contact" className="min-h-[60vh] flex flex-col justify-center px-2 sm:px-4 py-24">
      <div className="container mx-auto max-w-2xl text-center space-y-8 fade-in">
        <div className="space-y-3">
          <motion.h2
            className="text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Get in Touch
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            Have a project in mind or just want to say hello? My inbox is open.
          </motion.p>
        </div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40, boxShadow: "0 0px 0px rgba(121,144,219,0)" }}
          animate={isInView ? { opacity: 1, y: 0, boxShadow: "0 0px 0px rgba(121,144,219,0)" } : { opacity: 0, y: 40, boxShadow: "0 0px 0px rgba(121,144,219,0)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-card rounded-lg p-6 sm:p-10 space-y-6"
          whileHover={{ boxShadow: "0 24px 64px rgba(121,144,219,0.25)" }}
        >
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto"
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Mail className="h-8 w-8" />
          </motion.div>
          <p className="text-muted-foreground">
            The best way to reach me is by email. I'll get back to you as soon as I can.
          </p>
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            style={{ display: "inline-block" }}
          >
            <Button size="lg" asChild>
              <a href="mailto:npalade09@gmail.com">
                <Mail className="h-4 w-4" />
                Send me an email
              </a>
            </Button>
          </motion.div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <motion.div
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button variant="outline" size="icon" asChild title="GitHub">
                <a
                  href="https://github.com/nickpalade"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button variant="outline" size="icon" asChild title="LinkedIn">
                <a
                  href="https://www.linkedin.com/in/nick-palade-7a9154262/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Button variant="outline" size="icon" asChild title="View CV">
                <a href="/cv">
                  <FileText className="h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
