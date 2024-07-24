import React from 'react';


export default function Footer({ copyrightText }) {
  return (
    <footer className="py-16 flex flex-col items-center">
      <p className="dark:text-white">{copyrightText}</p>
    </footer>
  );
}
