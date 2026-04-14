// ===========================================
//  src/components/Icons.jsx
//  Shared SVG icon component
// ===========================================

export const Icon = ({ d, size = 20, className, style, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
    {...props}
  >
    <path d={d} />
  </svg>
);

export const icons = {
  calIcon: "M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z",
  chevronL: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  chevronR: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  moreH: "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
};
