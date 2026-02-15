export interface NavigationLink {
  name: string;
  path: string;
  shortcut?: string;
}

export const navigationLinks: NavigationLink[] = [
  { 
    name: "home", 
    path: "/", 
    shortcut: "H"
  },
  { 
    name: "career", 
    path: "/career", 
    shortcut: "C"
  },
  { 
    name: "projects", 
    path: "/projects", 
    shortcut: "P"
  },
  { 
    name: "skills", 
    path: "/skills", 
    shortcut: "S"
  },
  {
    name: "certifications",
    path: "/certifications",
    shortcut: "R"
  },
  {
    name: "performance",
    path: "/performance",
    shortcut: "F"
  },
  {
    name: "activity",
    path: "/activity",
    shortcut: "G"
  },
  {
    name: "contact",
    path: "/contact",
    shortcut: "T"
  },
]; 