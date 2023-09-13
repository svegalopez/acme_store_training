import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "../Button/Button";
import styles from "./Dialog.module.css";
import { XCircle } from "react-feather";

export default ({
  triggerText,
  triggerClass,
  content,
  hidden,
  open,
  onOpenChange,
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {triggerText && (
      <Dialog.Trigger asChild>
        <Button className={triggerClass} hidden={hidden}>
          {triggerText}
        </Button>
      </Dialog.Trigger>
    )}

    <Dialog.Portal>
      <Dialog.Overlay className={styles.dialogOverlay} />
      <Dialog.Content className={styles.dialogContent}>
        <Dialog.Close asChild>
          <button className={styles.closeBtn} aria-label="Close">
            <XCircle />
          </button>
        </Dialog.Close>
        {content}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
