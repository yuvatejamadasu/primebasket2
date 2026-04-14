import React from 'react';
export default function Layout({ children }) {
  return <div className="flex flex-col gap-6 w-full">{children}</div>;
}
