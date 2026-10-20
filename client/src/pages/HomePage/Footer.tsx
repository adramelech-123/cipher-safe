const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src="/ciphersafe.svg" alt="CipherSafe logo" className="w-8 h-8" />
          <span className="font-black text-lg text-white">
            CipherSafe
          </span>
        </div>
        <p className="text-sm text-slate-500">
          CipherSafe &copy; {year} - End-to-end encrypted password manager
        </p>
      </div>
    </footer>
  );
};

export default Footer;