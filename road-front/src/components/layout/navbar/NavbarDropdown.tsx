import { DropdownProps } from "@/types/Navbar";
import { useState } from "react";

export const NavbarDropdown: React.FC<DropdownProps> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center hover:text-gray-300 transition-colors">
        {item.icon && <span className="mr-1">{item.icon}</span>}
        {item.label}
        <span className="ml-1">▼</span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-2 bg-gray-700 rounded shadow-lg py-2 min-w-[150px] z-10">
          {item.children.map((child) =>
            child.type === "link" ? (
              <li key={child.id}>
                <a
                  href={child.href}
                  className="block px-4 py-2 hover:bg-gray-600 transition-colors"
                >
                  {child.label}
                </a>
              </li>
            ) : (
              <NavbarDropdown key={child.id} item={child} />
            )
          )}
        </ul>
      )}
    </li>
  );
};
