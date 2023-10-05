import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp, LogOut } from "react-feather";
import styles from "./LogoutDropdown.module.css";

function LogOutDropDown({ label, logoutHandler }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu.Root onOpenChange={() => setOpen((prev) => !prev)}>
      <DropdownMenu.Trigger asChild>
        <button className={styles.logoutLink}>
          {label}
          {open ? (
            <ChevronDown className={styles.dropDownIcon} size={16} />
          ) : (
            <ChevronUp className={styles.dropDownIcon} size={16} />
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align={"end"}
          className={styles.dropDownContent}
        >
          <DropdownMenu.Item
            onSelect={logoutHandler}
            className={styles.dropDownItem}
          >
            <LogOut className={styles.dropDownIcon} size={16} />
            <span> logout</span>
          </DropdownMenu.Item>
          <DropdownMenu.Arrow style={{ fill: "white" }} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

export default LogOutDropDown;
