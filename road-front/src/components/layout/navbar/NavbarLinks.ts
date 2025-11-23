export type NavbarItemStatic =
  | { type: "link"; id: string; href: string }
  | { type: "dropdown"; id: string; children: NavbarItemStatic[] };

export const navbarItemsStatic: NavbarItemStatic[] = [
  { type: "link", id: "navbar_items_home", href: "/" },
  // {
  //   type: "dropdown",
  //   id: "navbar_items_members",
  //   children: [
  //     { type: "link", id: "placeholders_1", href: "/servicios/web" },
  //     { type: "link", id: "placeholders_2", href: "/servicios/seo" },
  //   ],
  // },
  // {
  //   type: "dropdown",
  //   id: "navbar_items_matches",
  //   children: [
  //     { type: "link", id: "placeholders_1", href: "/servicios/web" },
  //     { type: "link", id: "placeholders_2", href: "/servicios/seo" },
  //   ],
  // },
  // { type: "link", id: "navbar_items_contact", href: "/contacto" },
  // { type: "link", id: "navbar_items_about", href: "/about" },
];
