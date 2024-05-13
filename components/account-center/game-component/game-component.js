import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './game-page.module.css';
import { ACCOUNT_GAME_RECORD_POST } from '@/components/config/api-path';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/auth-context';
import toast from 'react-hot-toast';
import { FaArrowRotateRight } from 'react-icons/fa6';

const GRID_SIZE = 18;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = 'RIGHT';
const INITIAL_SPEED = 150;

const GameComponent = () => {
  const generateFoodPosition = () => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  });

  const [gameStarted, setGameStarted] = useState(false); // 新增Start Game的狀態
  const [canMove, setCanMove] = useState(false); // 新增蛇是否可以移動的狀態
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(generateFoodPosition());
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef();
  const [currentDirection, setCurrentDirection] = useState('');
  const [pressedKey, setPressedKey] = useState('');
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isTiming, setIsTiming] = useState(false);
  const [endTime, setEndTime] = useState(0);
  const router = useRouter();
  const { auth, getAuthHeader } = useAuth();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const startTimeRef = useRef(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const GameRecord = async (myForm) => {
    try {
      const r = await fetch(`${ACCOUNT_GAME_RECORD_POST}/${router.query.sid}`, {
        method: 'POST',
        body: JSON.stringify(myForm),
        headers: { ...getAuthHeader(), 'content-type': 'application/json' },
      });
      const result = await r.json();
      console.log(result);
      return result;
    } catch (ex) {
      console.log('catchEx:', ex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('click');
    const gameScore = score;
    const gameTime = endTime;
    if (gameTime === 0) {
      toast.error('時間不能為0', { duration: 1500 });
      return;
    }
    //ms轉換格式 00:00:00 hh:mm:ss
    const seconds = Math.floor(gameTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const padZero = (num) => (num < 10 ? `0${num}` : num);
    const formattedTime = `00:${padZero(minutes)}:${padZero(remainingSeconds)}`;

    //包裝成myFrom fetch 上傳紀錄
    let myForm = { gameScore, formattedTime };
    try {
      toast.promise(GameRecord(myForm), {
        loading: '登入中...',
        success: (result) => {
          if (!result.success) {
            throw new Error('新增時出現錯誤');
          }
          if (result.getPointPlay) {
            toast.success('每日遊戲獲得10積分', { duration: 1500 });
          }
          setEndTime(0);
          setScore(0);
          setBtnDisabled(false);
          return '新增紀錄成功';
        },
        error: (e) => {
          return `${e}`;
        },
      });

      // console.log(result);
    } catch (ex) {
      console.error('Error:', ex);
    }
  };

  useEffect(() => {
    if (canMove) {
      const interval = setInterval(moveSnake, speed);

      return () => clearInterval(interval);
    }
  }, [canMove, snake]);

  //監聽鍵盤操作
  useEffect(() => {
    const handleKeyPress = (e) => {
      // console.log('Key pressed:', event.key);
      const key = e.key.toUpperCase().replace('ARROW', '');
      if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(key)) {
        // 防止默認行為，比如捲動網頁
        e.preventDefault();

        // 檢查按下的鍵是否與當前移動方向相反，如果是，則忽略
        const oppositeDirection = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT',
        };
        if (oppositeDirection[key] !== currentDirection) {
          setPressedKey(key);
          setDirection(key);
          setCurrentDirection(key);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentDirection]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        if (!gameStarted) {
          handleStartGame();
        } else if (gameOver) {
          handleRestart();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, gameOver]); // 監聽 gameStarted 和 gameOver 狀態變化

  //按下遊戲開始後 紀錄時間
  useEffect(() => {
    if (gameStarted) {
      setIsTiming(true); // 遊戲開始開啟計時
      startTimeRef.current = Date.now() - elapsedTime;
      // console.log('stimeRef:', startTimeRef.current);
      const newTimer = setInterval(() => {
        // setTime((prevTime) => prevTime + 1);
        setTime(Date.now() - startTimeRef.current);
      }, 10);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    } else {
      // 清除計時器
      clearInterval(timer);
      setIsTiming(false); // 遊戲結束停止計時
      setTimer(null); // 將計時器狀態設為null
    }
  }, [gameStarted]);

  //控制蛇的移動
  const moveSnake = () => {
    const head = { ...snake[0] };
    const newSnake = [head, ...snake.slice(0, -1)];

    // 檢查新方向是否與當前移動方向相反，如果是，則忽略新方向
    switch (direction) {
      case 'UP':
        if (currentDirection === 'DOWN') return;
        head.y -= 1;
        break;
      case 'DOWN':
        if (currentDirection === 'UP') return;
        head.y += 1;
        break;
      case 'LEFT':
        if (currentDirection === 'RIGHT') return;
        head.x -= 1;
        break;
      case 'RIGHT':
        if (currentDirection === 'LEFT') return;
        head.x += 1;
        break;
      default:
        break;
    }

    // 判斷蛇頭與蛇身碰撞
    if (
      newSnake
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      handleGameOver();
      return;
    }

    // 判斷是否碰到邊界
    if (head.x < 0 || head.x >= 19.0 || head.y < 0 || head.y >= 18) {
      handleGameOver();
      return;
    }

    // 更新蛇的位置
    setSnake(newSnake);

    // 如果吃到食物，增加長度並生成新食物，得到一分
    if (
      newSnake.some((segment) => segment.x === food.x && segment.y === food.y)
    ) {
      setFood(generateFoodPosition());
      newSnake.push(snake[snake.length - 1]);
      setScore((prevScore) => prevScore + 1);
    }
  };

  //蛇頭的轉動方向計算
  const calculateRotation = (direction) => {
    // 根據方向選轉角度
    let targetRotation = 0;
    switch (direction) {
      case 'UP':
        targetRotation = 180;
        break;
      case 'DOWN':
        targetRotation = 0;
        break;
      case 'LEFT':
        targetRotation = -270;
        break;
      case 'RIGHT':
        targetRotation = -90;
        break;
      default:
        targetRotation = -90;
        break;
    }

    // 計算蛇頭當前的旋轉角度
    let currentRotation = 0;
    if (snake.length > 0) {
      const head = snake[0];
      switch (currentDirection) {
        case 'UP':
          currentRotation = 180;
          break;
        case 'DOWN':
          currentRotation = 0;
          break;
        case 'LEFT':
          currentRotation = -270;
          break;
        case 'RIGHT':
          currentRotation = -90;
          break;
        default:
          currentRotation = -90;
          break;
      }
    }

    // 根據當前角度和目標角度計算新的角度
    const diff = targetRotation - currentRotation;
    const step = diff / 20; // 步長，可以根據需要調整
    return currentRotation + step + 'deg'; // 將結果轉換為字串
  };

  //渲染蛇的身體
  const renderSnake = useMemo(() => {
    if (!gameStarted || gameOver) {
      return null; // 如果遊戲未開始或遊戲結束，則不渲染蛇
    }

    return snake.map((segment, index) => (
      <div
        className={`bg-neongreen rounded-full  ${
          index === 0 ? 'relative' : 'border border-dark'
        }`}
        key={index}
        style={{
          position: 'absolute',
          top: segment.y * 18,
          left: segment.x * 18,
          width: 19.5,
          height: 19.5,
          transform: `rotate(${calculateRotation(direction)})`, // 根據方向選轉角度
        }}
      >
        {index === 0 && (
          <img
            src="/snakeHead.png"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '155%',
            }}
          />
        )}
      </div>
    ));
  }, [gameStarted, gameOver, snake, direction]);

  //渲染食物
  const renderFood = useMemo(() => {
    return (
      // <FaHeart
      //   className={`${styles[`lds-heart`]} text-neonpink`}
      //   style={{
      //     position: 'absolute',
      //     top: food.y * 18,
      //     left: food.x * 18,
      //     width: 20,
      //     height: 20,
      //   }}
      // />
      <div
        className={`${styles[`lds-heart`]} text-neonpink`}
        style={{
          position: 'absolute',
          top: food.y * 18,
          left: food.x * 18,
          width: 20,
          height: 20,
        }}
      >
        <div></div>
      </div>
    );
  }, [food]);

  //按下Start Game的處理
  const handleStartGame = () => {
    setGameStarted(true); // click遊戲開始後設定開始狀態為 true
    setCanMove(true); // 設置蛇可以移動
    setDirection(INITIAL_DIRECTION); // 設置方向為初始方向
    setCurrentDirection(INITIAL_DIRECTION); // 設置當前方向為初始方向
    let newFoodPosition = generateFoodPosition();
    // 確保食物與蛇位置不相同
    while (
      snake.some(
        (segment) =>
          segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
      )
    ) {
      newFoodPosition = generateFoodPosition();
    }
    setFood(newFoodPosition); // 設置新食物位置
    // 啟動計時器
    startTimeRef.current = Date.now() - elapsedTime;
    const newTimer = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10); // 每秒更新時間
    setTimer(newTimer); // 將計時器存在變量中
  };

  // GameOver時停止計時，紀錄時間
  const handleGameOver = () => {
    clearInterval(timer); // 清除計時器
    setDirection(INITIAL_DIRECTION); // 將方向設置為初始方向
    setGameOver(true);
    setEndTime(time); // 紀錄遊戲結束時間
    setIsTiming(false); // 停止計時器
    setCanMove(false); // 遊戲結束時停止蛇移動
    setBtnDisabled(true);
  };

  //按下Restart的處理
  const handleRestart = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION); // 如果 currentDirection 為空，則設置為初始方向
    setCurrentDirection(INITIAL_DIRECTION); // 設置 currentDirection 為初始方向
    setFood(generateFoodPosition());
    setScore(0);
    setTime(0);
    setElapsedTime(0);
    clearInterval(timer); // 清除計時器
    setGameOver(false);
    setCanMove(true); // 重新開始遊戲時設置蛇可以移動
    setPressedKey(''); // 清除按下的方向鍵
    startTimeRef.current = Date.now();
    console.log('restart-time', time);
    console.log('restart-timer', timer);
    console.log('restart-timeRef', startTimeRef.current);
  };

  //按鈕的渲染
  const renderArrow = (direction, icon, position) => {
    const isActive =
      gameStarted &&
      !gameOver &&
      (currentDirection === direction || pressedKey === direction);
    const isDisabled = !gameStarted || gameOver; // 禁用條件：遊戲未開始或遊戲結束

    // 檢查是否與當前移動方向相反
    const isOppositeDirection =
      (direction === 'UP' && currentDirection === 'DOWN') ||
      (direction === 'DOWN' && currentDirection === 'UP') ||
      (direction === 'LEFT' && currentDirection === 'RIGHT') ||
      (direction === 'RIGHT' && currentDirection === 'LEFT');

    return (
      <div
        className={`absolute w-[50px] h-[50px] cursor-pointer ${
          position ? position : 'right-[75px] bottom-[115px]'
        } ${
          isActive && !isOppositeDirection ? 'text-green-500 ' : 'text-gray-400'
        }`}
        onClick={() => {
          if (!isDisabled && !isOppositeDirection) {
            // 禁用條件下不處理點擊事件，也不處理與當前移動方向相反的方向
            setDirection(direction);
            setCurrentDirection(direction);
          }
        }}
      >
        <kbd
          className={`kbd relative cursor-pointer text-[25px] w-[50px] h-[50px] ${
            isActive ? 'text-green-500 ' : 'text-gray-400'
          }`}
        >
          {icon}
          <span
            className={`absolute ${
              isActive
                ? 'text-green-500 animate-shake transform-gpu scale-[3]'
                : 'text-gray-400'
            }`}
          >
            {icon}
          </span>
        </kbd>
      </div>
    );
  };

  return (
    <>
      {/* Header 記錄區 */}
      <div className="container flex justify-between items-center  border-dark max-h-[53px] pt-4 pb-3">
        <div
          style={{
            fontFamily: 'monospace',
            textShadow: '2px 2px 2px hsla(0,0%,0%,1)',
          }}
          className="flex flex-col text-[14px] text-center text-white basis-1/4 ms-4"
        >
          分數{' '}
          <span
            className="font-bold text-[14px] "
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 2px hsla(0,0%,0%,1)',
            }}
          >
            {score < 100 ? (score < 10 ? `00${score}` : `0${score}`) : score}
          </span>
        </div>
        {/* <span className="text-white basis-1/4"> </span> */}
        <div
          style={{
            fontFamily: 'monospace',
            textShadow: '2px 2px 2px hsla(0,0%,0%,1)',
          }}
          className="flex flex-col text-[14px] text-center text-white basis-1/4 me-2"
        >
          {' '}
          時間
          <span
            className="font-bold text-[14px] "
            style={{
              fontFamily: 'monospace',
              textShadow: '2px 2px 2px hsla(0,0%,0%,1)',
            }}
          >
            {gameOver
              ? `${Math.floor((endTime / (1000 * 60)) % 60)
                  .toString()
                  .padStart(2, '0')}:${Math.floor((endTime / 1000) % 60)
                  .toString()
                  .padStart(2, '0')}:${Math.floor((endTime % 1000) / 10)
                  .toString()
                  .padStart(2, '0')}`
              : `${Math.floor((time / (1000 * 60)) % 60)
                  .toString()
                  .padStart(2, '0')}:${Math.floor((time / 1000) % 60)
                  .toString()
                  .padStart(2, '0')}:${Math.floor((time % 1000) / 10)
                  .toString()
                  .padStart(2, '0')}`}
          </span>
        </div>
      </div>
      {/* Body 遊戲區 */}
      <div className="container relative w-full min-h-[527px]  ">
        <div
          className="bg-slate-700"
          ref={gameRef}
          tabIndex="0" // 設置元素可聚焦，從而能夠接收鍵盤事件
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: GRID_SIZE * 19.2, // 根據格子數量計算遊戲區域寬度
            height: GRID_SIZE * 18.45, // 根據格子數量計算遊戲區域高度
            borderTop: '3px solid black',
            borderBottom: '3px solid black',
            borderLeft: 'none',
            borderRight: 'none',
          }}
        >
          {renderSnake}
          {renderFood}
        </div>

        {/*Footer-Left 控制遊戲速度 */}
        <div className="absolute bottom-[40px] left-[40px] flex ">
          <div className="relative flex flex-col ">
            <div className="bg-dark w-[160px] h-[60px] absolute left-[-25px] bottom-[45px] border rounded-full border-slate-500 transform rotate-45"></div>
            <button
              onClick={() => {
                setSpeed(300);
              }}
              className={`${
                speed === 300
                  ? 'border-slate-200 text-slate-200 bg-slate-700'
                  : 'border-slate-700 text-slate-500 '
              }  kbd text-nowrap text-[12px] absolute bottom-[90px] left-0 border rounded-full h-[40px] w-[40px]`}
            >
              簡單
            </button>
            <button
              onClick={() => {
                setSpeed(150);
              }}
              className={`${
                speed === 150
                  ? 'border-slate-200 text-slate-200 bg-slate-700'
                  : 'border-slate-700 text-slate-500 '
              } kbd text-nowrap text-[12px] absolute bottom-[55px] left-[35px]  border rounded-full h-[40px] w-[40px] `}
            >
              一般
            </button>
            <button
              onClick={() => {
                setSpeed(50);
              }}
              className={`${
                speed === 50
                  ? 'border-slate-200 text-slate-200 bg-slate-700'
                  : 'border-slate-700 text-slate-500 '
              } kbd text-nowrap text-[12px] absolute bottom-[20px] left-[70px]  border rounded-full h-[40px] w-[40px] `}
            >
              困難
            </button>
          </div>
        </div>
        <div className="absolute bottom-[-20px] left-[20px] flex ">
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={btnDisabled ? false : true}
            className={`${
              !btnDisabled
                ? 'border-slate-700 text-slate-700'
                : 'border-slate-200  text-slate-200 bg-dark animate-pulse shadow-xl4 cursor-pointer hover:text--slate-200 hover:bg-slate-700'
            }
             border-slate-200 transform rotate-45 text-slate-200 bg-dark kbd 
             text-nowrap text-[12px] absolute bottom-[70px] left-0 border rounded-full h-full w-[70px]`}
          >
            保存記錄
          </button>
        </div>

        {/*Footer-Right 方向鍵 */}
        {renderArrow('UP', '▲', 'right-[75px]  bottom-[135px]')}
        {renderArrow('RIGHT', '▶︎', 'right-[20px]  bottom-[80px]')}
        {renderArrow('LEFT', '◀︎', 'right-[130px]  bottom-[80px]')}
        {renderArrow('DOWN', '▼', 'right-[75px]  bottom-[25px]')}

        {!gameStarted && (
          <div
            className={`absolute group transform -translate-x-1/2 top-[125px] left-[50%] ${
              gameOver ? 'hidden' : ''
            }`}
          >
            <div
              onClick={handleStartGame}
              className="cursor-pointer neon__button"
            >
              <a className="w-[250px] relative">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Start Game
                <span className="">→</span>
              </a>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute top-[70px] left-[17px] flex flex-col z-20 justify-center">
            <p className="text-[56px] text-nowrap p-2 mb-4 text-red-500 ">
              Game Over
            </p>

            <kbd
              // className="border-2 rounded-full bg-neongreen text-dark btn hover:bg-neonpink "
              className="px-2 py-1.5 text-4xl flex justify-center items-center font-semibold text-center text-gray-800 bg-dark bg-opacity-30 hover:bg-dark border  border-gray-200 rounded-lg cursor-pointer  dark:text-gray-100 dark:border-gray-500"
              onClick={handleRestart}
            >
              <FaArrowRotateRight className="me-6" />
              Restart
            </kbd>
          </div>
        )}
      </div>
    </>
  );
};

export default GameComponent;
