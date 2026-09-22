import Image from "next/image";

const loading = () => {
  return (
    <div className="mt-16 w-full flex-center">
      <Image
        src="/loader.svg"
        alt="loader"
        width={50}
        height={50}
        className="object-contain"
      />
    </div>
  );
};

export default loading;
