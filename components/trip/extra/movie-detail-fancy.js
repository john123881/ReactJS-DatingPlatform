export default function MovieDetailFancy() {
  return (
    <div className="w-96 h-32 overflow-scroll line-clamp-4 hidden sm:block">
      {/* 故事大綱 */}
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">故事大綱</h3>
        <p className="text-gray-700 leading-relaxed">
          威利·旺卡（提摩西·夏勒梅
          飾）是一位充滿夢想的年輕巧克力製造師，他帶著母親傳授的獨門配方，獨自來到巧克力聞名遐邇的「大都會」展開創業之旅。然而，他很快發現這座城市被「巧克力聯盟」——由三位老牌巧克力大亨組成的壟斷集團——所掌控，他們禁止任何新的巧克力品牌進入市場，並利用卑劣手段打壓競爭者。
        </p>
      </div>

      {/* 演員 */}
      <div>
        <h3 className="text-lg font-bold mb-2">演員</h3>
        <ul className="text-gray-700 leading-relaxed">
          <li>提摩西·夏勒梅 飾演 威利·旺卡</li>
          <li>柯林·歐布萊恩（Colin O&apos;Brien）飾演 年幼的威利·旺卡</li>
          <li>卡拉·蓮恩 飾演 小麵（Noodle）</li>
          <li>基根-麥可·奇 飾演 警察局長</li>
          <li>派特森·約瑟夫 飾演 亞瑟·斯洛華斯（Arthur Slugworth）</li>
          <li>奧利維亞·柯爾曼 飾演 史瓜比夫人（Mrs. Scrubbit）</li>
          <li>羅溫·艾金森 飾演 神父</li>
          <li>休·葛蘭 飾演 奧吉（Oompa Loompa）</li>
          <li>派特森·約瑟夫 飾演 亞瑟·斯拉華斯的侄女</li>
        </ul>
      </div>
    </div>
  );
}
