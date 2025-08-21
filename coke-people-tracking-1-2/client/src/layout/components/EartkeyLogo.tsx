import eartkeyLogo from "/eartkey.png";

const EartkeyLogo: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-20 p-4 absolute bottom-6 z-[9999]">
      <p className="font-semibold text-md text-[#0e2df6]">TECHNOLOGY PARTNER</p>
      <img
        className=""
        src={eartkeyLogo}
        alt="Company Logo"
        style={{ width: 160 }}
      />
    </div>
  );
};

export default EartkeyLogo;
