interface BrandHeaderProps {
  logoSize: string,
  headingSize: string,
  subTextSize: string,
  addClass?: string
}

const BrandHeader = ({logoSize, headingSize, subTextSize, addClass}: BrandHeaderProps) => {
  return (
    <div className={`${addClass} flex flex-col justify-center items-center font-black text-center mb-5 w-full`}>
      <span className="flex flex-col gap-2 items-center justify-center">
        <img src="/ciphersafe.svg" alt="" className={logoSize} />
        <h1 className={headingSize}>CipherSafe</h1>
      </span>
      <p className={`${subTextSize} font-normal italic`}>
        Protect your accounts with Unbreakable Security
      </p>
    </div>
  );
}
export default BrandHeader