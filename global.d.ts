// Déclarations de types pour les fichiers CSS
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Déclarations de types pour les modules CSS
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// Déclarations de types pour les fichiers SCSS
declare module "*.scss" {
  const content: { [className: string]: string };
  export default content;
}

// Déclarations de types pour les modules SCSS
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
