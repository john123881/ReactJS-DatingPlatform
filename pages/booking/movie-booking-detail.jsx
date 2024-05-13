import './index';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import YouTube from 'react-youtube';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PageTitle from '@/components/page-title';

export default function Index({ onPageChange }) {
  const pageTitle = '電影探索';
  const router = useRouter();
  useEffect(() => {
    onPageChange(pageTitle);
    if (!router.isReady) return;
  }, [router.query]);

  const [clickedButton, setClickedButton] = useState(null);
  const descriptionRef = useRef(null); // 创建对电影描述元素的引用

  const [showFullDescription, setShowFullDescription] = useState(false); // 初始化电影描述显示状态为false

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription); // 切换电影描述显示状态
  };

  const scrollToDescription = () => {
    if (descriptionRef.current) {
      descriptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const [hovered, setHovered] = useState(false);

  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);

  const handleButtonClick = () => {
    setClickedButtonIndex((prevIndex) => (prevIndex === null ? 0 : null)); // 切换样式
  };

  const BookingConfirmModal = dynamic(
    () => import('@/components/bar/modal/booking-confirm-modal'),
    { ssr: false }
  );
  const [selectedTime, setSelectedTime] = useState('');

  return (
    <>
      <PageTitle pageTitle={pageTitle} />
      <div className="flex justify-center">
        <div style={{ width: '100%' }}>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            {/* 電影影片播放 */}
            <div className="card bg-transparent shadow-xl">
              {/* <video controls className="w-full" style={{ maxHeight: '493px' }}>
                <source
                  src="https://www.example.com/video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video> */}
            </div>

            {/* 電影資訊 */}
            <div className="card lg:card-side bg-transparent shadow-xl p-20 mx-4 mt-11">
              <figure>
                <img src="/movie_img/movie_2.jpg" />
              </figure>
              <div className="card-body" style={{ width: '200px' }}>
                <h2 className="card-title pb-2" style={{ fontSize: '2rem' }}>
                  旺卡
                  <button
                    className="btn btn-outline btn-accent mx-20"
                    style={{
                      height: '0.5rem',
                      borderColor: '#A0FF1F',
                      color: clickedButton
                        ? 'black'
                        : hovered
                        ? '#A0FF1F'
                        : '#FFFFFF',
                      backgroundColor: clickedButton
                        ? '#A0FF1F'
                        : 'transparent',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={() => setClickedButton(!clickedButton)}
                  >
                    {/* 愛心圖標 */}
                    <FontAwesomeIcon
                      icon={faHeart}
                      className="heart-icon"
                      style={{
                        color: clickedButton
                          ? 'red'
                          : hovered
                          ? '#A0FF1F'
                          : 'white',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        // 切換按鈕點擊狀態
                        setClickedButton(
                          clickedButton === 'heart' ? null : 'heart'
                        );
                      }}
                    />
                    加入收藏
                  </button>
                </h2>
                <div className="review flex ">
                  <span>5.0</span>
                  <div className="bar-detail-stars flex gap-1.5 rating rating-sm mx-2 mt-1">
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                    />
                    <input
                      type="radio"
                      name="rating-6"
                      className="mask mask-star-2 bg-[#A0FF1F]"
                      checked
                    />
                  </div>
                </div>
                <p
                  style={{
                    maxHeight: showFullDescription ? 'none' : '3em',
                    overflow: 'hidden',
                  }}
                >
                  《旺卡》（英語：Wonka）是一部2023年英美合拍歌舞奇幻片，由保羅·金執導並與西蒙·法納比編劇。該片是1971年電影《歡樂糖果屋》的前傳，改編自羅爾德·達爾的1964年小說《查理與巧克力工廠》，音樂劇類型的本片探索了「威利·旺卡」成立巧克力冒險工廠之前的旅程。主演陣容包括提摩西·夏勒梅、卡拉·蓮恩、基根-麥可·奇、派特森·約瑟夫、麥特·盧卡斯、馬修·貝恩頓、莎莉·霍金斯、羅溫·艾金森、吉姆·卡特、湯姆·戴維斯、奧莉薇亞·柯爾曼和休·葛蘭。
                  《旺卡》2023年12月15日在美國院線上映。電影獲得媒體與影評界正面為主的評價，製作、佈景、風格、配樂、提摩西·夏勒梅的演出表現尤其獲得好評。
                </p>
                {!showFullDescription && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setShowFullDescription(true);
                        scrollToDescription();
                      }}
                    >
                      More
                    </button>{' '}
                    {/* 点击按钮显示更多描述并滚动到描述位置 */}
                  </div>
                )}
              </div>
            </div>

            {/* 電影時刻/電影介紹 */}
            <div className="flex justify-center  mx-12">
              {/* 在这里添加 mb-8 来增加上下间距 */}
              <div style={{ width: '100%' }}>
                <div role="tablist" className="tabs tabs-bordered pt-8 pb-8">
                  <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab"
                    aria-label="電影時刻"
                    style={{ width: '130px' }}
                  />
                  <div role="tabpanel" className="tab-content p-10">
                    <form className="space-y-4">
                      <div className="text-[15px] lg:text-[20px] text-white">
                        選擇電影時段
                      </div>
                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          全票
                        </label>
                        <br />
                        <select className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2">
                          <option disabled selected>
                            選擇張數
                          </option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          優待票
                        </label>
                        <br />
                        <select className="select select-bordered select-sm w-full max-w-xs text-[15px] lg:text-[18px] mt-2">
                          <option disabled selected>
                            選擇張數
                          </option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                        </select>
                        <p className="text-[12px] text-white mt-1">
                          （優待票請出示相關證明）
                        </p>
                      </div>
                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          電影日期
                        </label>
                        <br />
                        <input
                          type="date"
                          className="input input-bordered input-sm w-full max-w-xs mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-[15px] lg:text-[18px] text-white">
                          電影時刻
                        </label>
                        <br />
                        <input
                          type="time"
                          className="input input-bordered input-sm w-full max-w-xs mt-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-white">其他備註</label>
                        <br />
                        <textarea
                          className="textarea textarea-bordered h-24 textarea-sm w-full max-w-xs"
                          placeholder=""
                        ></textarea>
                      </div>
                      <div
                        type="submit"
                        className="btn w-[320px] bg-[#A0FF1F] text-black border-none rounded-[20px] hover:bg-[#A0FF1F]"
                        onClick={() =>
                          document
                            .getElementById('movie-confirm-modal')
                            .showModal()
                        }
                      >
                        <span className="text-h6 text-black">確認訂票</span>
                      </div>
                    </form>

                    <br></br>
                    <br></br>
                    <br></br>

                    {/* <div className="flex flex-col w-full border-opacity-50">
                      <div className="grid h-20 card rounded-box place-items-start">
                        <div className="flex items-center justify-between w-full">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div>座位狀態</div>
                          <div>
                            <span className="badge">充足</span>
                            <span className="badge">緊張（40%以下）</span>
                            <span className="badge">告急（5%以下）</span>
                          </div>
                        </div>
                      </div>
                      <div className="divider"></div>
                    </div> */}

                    {/* 電影區域 */}
                    {/* <div style={{ marginBottom: '20px' }}>
                      <select className="select select-bordered w-full max-w-xs bg-transparent">
                        <option disabled selected>
                          選擇區域
                        </option>
                        <option>北投區</option>
                        <option>士林區</option>
                        <option>中山區</option>
                        <option>大同區</option>
                        <option>松山區</option>
                        <option>內湖區</option>
                        <option>萬華區</option>
                        <option>中正區</option>
                        <option>大安區</option>
                        <option>信義區</option>
                        <option>文山區</option>
                        <option>南港區</option>
                      </select>
                    </div> */}

                    {/* <div className="card w-96 shadow-xl bg-transparent">
                      <div className="card-body flex justify-between items-center">
                        <div className="flex items-center">
                          <h2
                            className="card-title pb-5"
                            style={{ marginRight: '19px' }}
                          >
                            喜滿客絕色影城
                          </h2>
                          <span
                            className="badge"
                            style={{
                              padding: '8px 16px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              color: '#fff',
                            }}
                          >
                            數位
                          </span>
                        </div>
                        <div className="card-actions flex">
                          <button
                            style={{
                              padding: '8px 16px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              color: '#fff',
                              transition: 'border-color 0.3s',
                              ':hover': {
                                borderColor: '#007bff',
                                color: 'red',
                              },
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = '#A0FF1F';
                              e.target.style.color = '#A0FF1F';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#ccc';
                              e.target.style.color = '#fff';
                            }}
                            onClick={() =>
                              document
                                .getElementById('my_modal_confirmed')
                                .showModal()
                            }
                          >
                            17:30
                          </button>
                          <dialog id="my_modal_confirmed" className="modal">
                            <div className="modal-box">
                              <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-lg">
                                確認電影場次
                              </h3>
                              <p className="py-4">
                                片名：
                                <br />
                                日期：
                                <br />
                                時間：
                                <br />
                              </p>
                              <button
                                onClick={() =>
                                  (window.location.href =
                                    '../../../booking/movie-seat')
                                }
                              >
                                確認場次，前往座位選擇
                              </button>
                            </div>
                          </dialog>

                          <button
                            style={{
                              padding: '8px 16px',
                              border: '1px solid #ccc',
                              borderRadius: '5px',
                              color: '#fff',
                              transition: 'border-color 0.3s',
                              ':hover': {
                                borderColor: '#007bff',
                              },
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = '#A0FF1F';
                              e.target.style.color = '#A0FF1F';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#ccc';
                              e.target.style.color = '#fff';
                            }}
                          >
                            21:40
                          </button>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <input
                    type="radio"
                    name="my_tabs_1"
                    role="tab"
                    className="tab"
                    aria-label="電影介紹"
                    checked
                    style={{ width: '130px' }}
                  />
                  <div role="tabpanel" className="tab-content p-10 mt-4 mx-2">
                    <div className="card bg-transparent shadow-xl">
                      <YouTube videoId="wzbT8cB554I" className="w-full" />
                    </div>

                    <p className="mt-12">
                      電影專注於威利·旺卡開設世界上最著名的巧克力工廠之前，年輕時期的生活及其冒險經歷：年輕時期的旺卡乘船抵達歐洲一座無名城市，以實現他在美食畫廊開設巧克力店的夢想。他決定住在狡猾的史瓜比夫人和她的追隨者布里奇爾開的自助洗衣店，認識孤兒小麵。儘管小麵警告他要閱讀細則，但由於旺卡不識文字還是自願簽署了合約，這迫使他在住宿期間被敲竹槓支付過高的費用。自信的旺卡前往美食走廊出售能讓食用者飛起來的「飄浮巧克力」，結果被走廊的三位主要巧克力製造商——史拉格沃斯先生、普羅德諾斯先生和費克勒格魯伯先生譏笑他開發的商品，通報警察局長沒收他當天的收入。
                      由於無力支付房租，史瓜比夫人迫使旺卡到自助洗衣店工作
                      10,000
                      天來償還債務。他與被史瓜比夫人困住的其他人一起工作：小麵、會計師阿巴庫斯、水管工派柏、喜劇演員賴瑞和電話接線員洛蒂。曾經在史拉格沃斯工作過的阿巴庫斯說明史拉格沃斯先生、普羅德諾斯先生和費克勒格魯伯先生組成了「巧克力卡特爾」，合謀消滅其他競爭對手，並且在一個教堂下設有一個運營基地，由貪腐的朱利斯神父和他的「巧克力狂」僧侶經營，他們在那裡儲存了大量的巧克力。旺卡製定了一個計劃，讓布里奇爾和史瓜比夫人彼此相愛，使他和小麵能夠秘密離開自助洗衣店並開始出售他的巧克力；而小麵則教導旺卡學會識字閱讀。巧克力卡特爾利用警察局長對巧克力的熱愛來讓其威脅旺卡離開小鎮。旺卡告訴小麵，他對巧克力的熱愛來自於他已故的母親，她在她去世前為他做了最後一塊巧克力。
                      有一天，旺卡意識到他的巧克力被一個跟蹤他多年的神秘橘色男子偷走了，他和小麵前往當地動物園從長頸鹿阿比蓋爾身上擠奶來補充製作巧克力的原料。旺卡和小麵招募阿巴庫斯、派珀、賴瑞和洛蒂幫助他出售巧克力來償還債務和提高他們的知名度，同時躲避史瓜比夫人和警察局長。同時，旺卡抓住了盜走他的巧克力的竊賊，一隻名叫洛夫蒂的奧帕倫帕人。幾年前，旺卡在洛夫蒂的監視下從奧帕倫帕斯奪走了珍貴的可可豆，奧帕倫帕斯驅逐了洛夫蒂追捕旺卡以償還債務，洛夫蒂騙旺卡逃跑了。
                      旺卡的團隊賺到了足夠的錢，可以向興奮的人群開設他夢想中的巧克力店。然而，警察局長和巧克力卡特爾知道了旺卡的行動。他們收買史瓜比夫人，讓她用「雪人的汗水」污染了售賣的巧克力，導致顧客的頭髮過度生長，皮膚變色，憤怒的人群摧毀了旺卡的商店作為報復。當團隊返回自助洗衣店時，卡特爾向旺卡揭露了自己是幕後黑手，並提出如果他離開小鎮並永遠停止製作巧克力，他們就會償還所有人的債務。旺卡接受了這個提議，並在當晚乘船離開。洛夫蒂與旺卡一起登上了船，激勵他返回城鎮反擊卡特爾，隨後兩人在意識到船即將爆炸後棄船而去。
                      債務還清後，阿巴庫斯、派珀、賴瑞和洛蒂被從自助洗衣店釋放，但史拉格沃斯付錢給史瓜比夫人，讓小麵被迫永遠留在裡面。旺卡和一行人救了小麵，旺卡告訴她，他推斷她是史拉格沃斯已故兄弟的女兒。當小麵被她的生母留給史拉格沃斯後，他意識到她可以挑戰他對家族財富的要求。史拉格沃斯把他的姪女賣給了史瓜比夫人，甚至向她的母親謊稱她已經死了。旺卡和團隊決定製定一個周密的計劃，透過阿巴庫斯先前在史拉格沃斯工作時發現的一本隱藏帳簿，揭發卡特爾的劣跡。
                      旺卡和小麵成功進入了基地，但還是被巧克力卡特爾發現，巧克力卡特爾迫使他們進入巧克力的儲藏室，打算用巧克力原漿淹死他們。旺卡讓他們給洛夫蒂一罐懸浮巧克力來償還他的債務，但卡特爾和朱利斯神父吃下了巧克力，洛夫蒂擊倒了朱利斯神父並救出了兩人。在外面對峙卡特爾和警察局長時，旺卡和小麵透過他們的帳簿向警察和公眾揭露了他們的行為，透過噴泉釋放了他們的巧克力儲備，其中摻有旺卡親自調製的配方，毀了他們的生意。由於懸浮巧克力的作用，卡特爾無法控制地懸浮，而警察局長被捕。人群透過品嚐旺卡的巧克力噴泉來慶祝。旺卡打開他母親製作的巧克力的包裝，發現一張金色的票劵，記載著他母親遺留的訊息，告訴他巧克力最好與人分享。最終旺卡與朋友們分享他母親的巧克力。
                      故事尾聲和片尾彩蛋交代了眾人的後續：旺卡幫助小麵和她的親生母親重逢，然後還清了他欠洛夫蒂的債務；旺卡還和洛夫蒂買下一座廢棄的城堡並開始建造一家工廠；阿巴庫斯如願和家人團圓；派柏回歸他喜歡的工作；回歸喜劇演員本職的賴瑞則在某場演出中和前妻破鏡重圓；洛蒂則回歸電話接線員的工作。至於史瓜比夫人和布里區，則因為被警方查獲先前故意在旺卡製造的巧克力投毒的證據而被移送法辦。
                      演員
                      提摩西·夏勒梅飾演威利·旺卡：電影主角，巧克力製造師、魔術師，為了實現開店夢想前往小鎮。
                      柯林·歐布萊恩（Colin O'Brien）飾演年幼的威利·旺卡
                      卡拉·蓮恩飾演小麵（Noodle）：被史瓜比夫人收養的孤兒，在史瓜比夫人經營的旅館工作，之後成為威利·旺卡的夥伴。實際上是亞瑟·斯拉華斯的侄女。
                      基根-麥可·奇飾演警察局長：熱愛吃巧克力。
                      派特森·約瑟夫飾演亞瑟·斯洛華斯（Arthur
                      Slugworth）：鎮上的巧克力製造商之一，威利·旺卡的競爭者。
                      麥特·盧卡斯飾演傑若·普諾斯（Prodnose）：鎮上的巧克力製造商之一，威利·旺卡的競爭者。
                      馬修·貝恩頓飾演菲利·菲克古柏（Ficklegruber）：鎮上的巧克力製造商之一，威利·旺卡的競爭者；上述三者都是聯合陷害旺卡的共犯結構。
                      莎莉·霍金斯飾演威利·旺卡之母
                      羅溫·艾金森飾演朱利斯神父（Father
                      Julius）：鎮上教堂的主教，愛吃巧克力，被斯拉華斯收買。
                      吉姆·卡特飾演愛算伯（Abacus
                      Crunch）：史瓜比夫人的洗衣工人之一，原本是會計師，之後成為威利·旺卡的夥伴。
                      湯姆·戴維斯飾演布里區（Bleacher）：史瓜比夫人的員工，負責監督其他洗衣工。
                      奧莉薇亞·柯爾曼飾演史瓜比夫人（Mrs.
                      Scrubbit）：鎮上的酒吧兼民宿老闆娘，個性狡猾經常使用詐欺的手法欺騙旅客變成洗衣工。
                      休·葛蘭飾演洛夫蒂 / 橘色小人（Lofty / Orange
                      Man）：歐帕倫普人（Oompa
                      Loompa），經常偷竊威利·旺卡的巧克力。
                      娜塔莎·羅斯威爾飾演派柏·賓士（Piper
                      Benz）：史瓜比夫人的洗衣工人之一，之後成為威利·旺卡的夥伴。
                      瑞奇·富爾切爾飾演賴瑞·恰可沃斯（Larry
                      Chucklesworth）：史瓜比夫人的洗衣工人之一，原本是喜劇演員，之後成為威利·旺卡的夥伴。
                      蘿基·塔克萊爾飾演洛蒂·貝爾（Lottie
                      Bell）：史瓜比夫人的洗衣工人之一，原本是電話接線生，之後成為威利·旺卡的夥伴。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
