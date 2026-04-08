import Link from 'next/link';

export default function BarTypeCards(bar, key) {
  return (
    <>
      <button className="">
        <Link href={`/bar/bar-list/1`}>
          <div className="py-4 ml-5 mr-5">
            <div className="relative py-2">
              <div className="w-[254px] hover:text-black">
                <img
                  className="object-cover w-[254px] h-[248px] rounded-[10px] opacity-50 transition-opacity hover:opacity-100"
                  src="https://images.unsplash.com/photo-1709131121957-87cb1a693e82?auto=format&fit=crop&q=80&w=254&h=248"
                  alt="運動酒吧"
                />
              </div>
              <div className="absolute items-center justify-center top-20 left-10">
                <p className="text-[20px] text-white m-2">運動酒吧</p>
                <p className="text-[20px] text-white m-2 ms-5">sport bar</p>
              </div>
            </div>
          </div>
        </Link>
      </button>
      <button className="">
        <Link href={`/bar/bar-list/2`}>
          <div className="py-4 ml-5 mr-5">
            <div className="relative py-2">
              <div className="w-[254px]">
                <img
                  className="object-cover w-[254px] h-[248px] rounded-[10px] opacity-50 transition-opacity hover:opacity-100"
                  src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=254&h=248"
                  width={254}
                  alt="音樂酒吧"
                />
              </div>
              <div className="absolute items-center justify-center top-20 left-10">
                <p className="text-[20px] text-white m-2">音樂酒吧</p>
                <p className="text-[20px] text-white m-2 ms-5">music bar</p>
              </div>
            </div>
          </div>
        </Link>
      </button>
      <button className="">
        <Link href={`/bar/bar-list/3`}>
          <div className="py-4 ml-5 mr-5">
            <div className="relative py-2">
              <div className="w-[254px]">
                <img
                  className="object-cover w-[254px] h-[248px] rounded-[10px] opacity-50 transition-opacity hover:opacity-100"
                  src="https://images.squarespace-cdn.com/content/v1/5ffdc197eebe5c34a6cacb49/1611940806525-ARLGJC62G4CGG1VD0MHK/international+front.jpg"
                  width={254}
                  alt="異國酒吧"
                />
              </div>
              <div className="absolute items-center justify-center top-20 left-10">
                <p className="text-[20px] text-white m-2">異國酒吧</p>
                <p className="text-[20px] text-white m-2 ms-5">foreign bar</p>
              </div>
            </div>
          </div>
        </Link>
      </button>
    </>
  );
}
