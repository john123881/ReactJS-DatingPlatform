import Link from 'next/link';
import Image from 'next/image';

export default function BarTypeCardsDown() {
  return (
    <>
      <button>
        <Link href={`/bar/bar-list/4`}>
          <div className="py-4 ml-5 mr-5">
            <div className="relative py-2">
              <div className="w-[410px]">
                <Image
                  className="object-cover w-[410px] h-[250px] rounded-[10px] opacity-50 transition-opacity hover:opacity-100"
                  src="https://magarticles.magzter.com/articles/11977/390333/5deb8a0917c92/SpecialityBars-The-New-Trend.jpg"
                  alt="特色酒吧"
                  width={410}
                  height={250}
                />
              </div>
              <div className="absolute top-20 left-40 text-center items-center justify-center">
                <p className="text-[20px] text-white m-2">特色酒吧</p>
                <p className="text-[20px] text-white m-2">specialty bar</p>
              </div>
            </div>
          </div>
        </Link>
      </button>
      <button>
        <Link href={`/bar/bar-list/5`}>
          <div className="py-4 ml-5 mr-5">
            <div className="relative py-2">
              <div className="w-[410px]">
                <Image
                  className="object-cover w-[410px] h-[250px] rounded-[10px] opacity-50 transition-opacity hover:opacity-100"
                  src="https://bartendersbusiness.com/en/articles/images/w/1200/BartendersBusiness-01222019060923000000-5c46b393188eb.jpg"
                  alt="其他酒吧"
                  width={410}
                  height={250}
                />
              </div>
              <div className="absolute top-20 left-40 text-center items-center justify-center">
                <p className="text-[20px] text-white m-2">其他酒吧</p>
                <p className="text-[20px] text-white m-2">others</p>
              </div>
            </div>
          </div>
        </Link>
      </button>
    </>
  );
}
