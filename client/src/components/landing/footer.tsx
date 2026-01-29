"use client";

export function Footer() {
  return (
    <footer className="relative w-full py-6 bg-gradient-to-t from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Arnob Sen Production
        </p>
      </div>
    </footer>
  );
}