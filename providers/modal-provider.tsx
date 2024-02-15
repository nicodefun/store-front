"use client";
import { PreviewModal } from "@/components/preview-modal";
import { useState, useEffect } from "react";

const ModalProvider = () => {
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!mounted) return null;
  return <>
  <PreviewModal/>
  </>;
};

export default ModalProvider;
