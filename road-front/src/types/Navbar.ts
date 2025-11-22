export interface NavbarLink {
  id: string;
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavbarDropdown {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children: NavbarItem[];
}

export type NavbarItemNoLabel =
  | { type: "link"; id: string; href: string }
  | { type: "dropdown"; id: string; children: NavbarItemNoLabel[] };

export type NavbarItem =
  | ({ type: "link" } & NavbarLink)
  | ({ type: "dropdown" } & NavbarDropdown);

export interface DropdownProps {
  item: Extract<NavbarItem, { type: "dropdown" }>;
}

export interface NavbarProps {
  items: NavbarItem[];
}
