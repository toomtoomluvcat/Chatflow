"use client";

import { useState, useEffect, ChangeEvent, useRef, FormEvent } from "react";

export default function LiveTypingChat() {
  const [messages, setMessages] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const editableRef = useRef<HTMLDivElement>(null);
  const placeholderText = "Type something here...";

  useEffect(() => {
    const handleInput = () => {
      const element = editableRef.current;
      if (element?.innerHTML?.trim() === "<br>") {
        element.innerHTML = "";
      }
    };

    const editableElement = editableRef.current;
    if (editableElement) {
      editableElement.addEventListener("input", handleInput);
    }

    return () => {
      if (editableElement) {
        editableElement.removeEventListener("input", handleInput);
      }
    };
  }, []);

  useEffect(() => {
    const websocket = new WebSocket("wss://chatflow-backend-1.onrender.com/ws");


    websocket.onopen = () => {
      setConnected(true);
    };

    websocket.onmessage = (event) => {
      setMessages(event.data);
    };

    websocket.onclose = () => {
      setConnected(false);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handlerDelete = () => {
    if (editableRef.current) {
      editableRef.current.textContent = "";
      setText("");
      if (ws) {
        ws.send("");
      }
    }
  };

  const handleInputChange = (e: FormEvent<HTMLDivElement> | null) => {
    if (!e) return;
    const newText: string = e.currentTarget.textContent || "";

    setText(newText);

    if (ws && connected) {
      ws.send(newText);
    }
  };

  return (
    <div className="max-w-screen overflow-hidden">
      <style jsx>{`
        .editable-with-placeholder:empty:before {
          content: attr(data-placeholder);
          color: #888;
          font-style: italic;
          position: absolute;
          pointer-events: none;
        }
      `}</style>

      <nav className="text-[0.9em] flex items-center justify-between container mx-auto py-5 md:px-8 px-5">
        <div className="flex w-fit items-center gap-x-2 border-green-100 border-[3px] bg-[#C7E6BB] px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full  bg-[#59D375]"></div>
          <span className="font-meduim text-[#59D375]">online</span>
        </div>
        <div className="flex mt-2 gap-x-2 items-center">
          <svg
            className="dark:text-white"
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3.71387"
              width="5.57143"
              height="13"
              rx="2.78571"
              fill="currentColor"
            />
            <rect
              x="13"
              y="3.71436"
              width="5.57143"
              height="13"
              rx="2.78571"
              transform="rotate(90 13 3.71436)"
              fill="currentColor"
            />
          </svg>
          <h2 className="font-caveat text-[1.8em] font-medium">Chatflow</h2>
        </div>
        <div className="flex items-center dark:bg-white bg-black px-4 gap-x-1 py-2 rounded-full border-zinc-300 border-[3px]">
          <svg
            className="text-white dark:text-black "
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.4,16.4,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65A8,8,0,0,0,128,181.1V32c.24,0,.27.08.35.26L153,91.86a8,8,0,0,0,6.75,4.92l63.91,5.16c.16,0,.25,0,.34.29S224,102.63,223.84,102.73Z"></path>
          </svg>
          <span className="text-white dark:text-black">Mode</span>
        </div>
      </nav>

      <div className="w-full py-4 relative ">
        <div className="absolute left-1/2 transform top-24  -translate-x-1/2">
          <svg
            className="absolute z-0 md:right-35 right-30 md:bottom-0 bottom-[-35px]"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.6764 17.0079C33.7497 17.3394 33.7361 17.6842 33.6367 18.0089C33.5373 18.3336 33.3556 18.627 33.1092 18.8606L17.8699 33.4725C17.613 33.7191 17.295 33.8926 16.9486 33.9751C16.6023 34.0576 16.2402 34.0462 15.8997 33.9419C15.5627 33.8398 15.259 33.6496 15.0199 33.3912C14.7807 33.1327 14.6147 32.8152 14.539 32.4713L9.83034 10.9478C9.75558 10.6037 9.77383 10.2459 9.88321 9.91114C9.9926 9.57642 10.1892 9.27687 10.4527 9.0433C10.7185 8.80645 11.0428 8.64486 11.392 8.57522C11.7411 8.50558 12.1026 8.53042 12.4389 8.64716L32.3874 15.5612C32.7088 15.6706 32.9965 15.8613 33.2223 16.1148C33.4482 16.3683 33.6046 16.676 33.6764 17.0079Z"
              fill="#AEACEB"
            />
          </svg>
          <svg
            className="absolute z-1 top-45 rotate-25 right-100 "
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.6764 17.0079C33.7497 17.3394 33.7361 17.6842 33.6367 18.0089C33.5373 18.3336 33.3556 18.627 33.1092 18.8606L17.8699 33.4725C17.613 33.7191 17.295 33.8926 16.9486 33.9751C16.6023 34.0576 16.2402 34.0462 15.8997 33.9419C15.5627 33.8398 15.259 33.6496 15.0199 33.3912C14.7807 33.1327 14.6147 32.8152 14.539 32.4713L9.83034 10.9478C9.75558 10.6037 9.77383 10.2459 9.88321 9.91114C9.9926 9.57642 10.1892 9.27687 10.4527 9.0433C10.7185 8.80645 11.0428 8.64486 11.392 8.57522C11.7411 8.50558 12.1026 8.53042 12.4389 8.64716L32.3874 15.5612C32.7088 15.6706 32.9965 15.8613 33.2223 16.1148C33.4482 16.3683 33.6046 16.676 33.6764 17.0079Z"
              fill="#AEACEB"
            />
          </svg>
          <svg
            className="absolute z-1 hidden md:block md:top-22 rotate-25 left-25"
            width="27"
            height="27"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.6764 17.0079C33.7497 17.3394 33.7361 17.6842 33.6367 18.0089C33.5373 18.3336 33.3556 18.627 33.1092 18.8606L17.8699 33.4725C17.613 33.7191 17.295 33.8926 16.9486 33.9751C16.6023 34.0576 16.2402 34.0462 15.8997 33.9419C15.5627 33.8398 15.259 33.6496 15.0199 33.3912C14.7807 33.1327 14.6147 32.8152 14.539 32.4713L9.83034 10.9478C9.75558 10.6037 9.77383 10.2459 9.88321 9.91114C9.9926 9.57642 10.1892 9.27687 10.4527 9.0433C10.7185 8.80645 11.0428 8.64486 11.392 8.57522C11.7411 8.50558 12.1026 8.53042 12.4389 8.64716L32.3874 15.5612C32.7088 15.6706 32.9965 15.8613 33.2223 16.1148C33.4482 16.3683 33.6046 16.676 33.6764 17.0079Z"
              fill="#AEACEB"
            />
          </svg>
          <svg
            className="absolute left-30 md:left-50 top-8 md:top-18"
            width="20"
            height="20"
            viewBox="0 0 43 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.3128 21.4998C40.3171 22.051 40.1496 22.5898 39.8335 23.0413C39.5174 23.4929 39.0685 23.8347 38.5492 24.0194L27.8932 27.8944L24.0199 38.5487C23.829 39.063 23.4852 39.5066 23.0348 39.8198C22.5844 40.1331 22.049 40.301 21.5003 40.301C20.9517 40.301 20.4162 40.1331 19.9659 39.8198C19.5155 39.5066 19.1717 39.063 18.9808 38.5487L15.1074 27.8927L4.45151 24.0194C3.93718 23.8285 3.4936 23.4847 3.18036 23.0343C2.86712 22.5839 2.69922 22.0485 2.69922 21.4998C2.69922 20.9512 2.86712 20.4158 3.18036 19.9654C3.4936 19.515 3.93718 19.1712 4.45151 18.9803L15.1074 15.107L18.9808 4.45102C19.1717 3.93669 19.5155 3.49311 19.9659 3.17987C20.4162 2.86663 20.9517 2.69873 21.5003 2.69873C22.049 2.69873 22.5844 2.86663 23.0348 3.17987C23.4852 3.49311 23.829 3.93669 24.0199 4.45102L27.8949 15.107L38.5492 18.9803C39.0685 19.165 39.5174 19.5068 39.8335 19.9583C40.1496 20.4099 40.3171 20.9487 40.3128 21.4998Z"
              fill="#F3B675"
            />
          </svg>
          <svg
            className="absolute right-25 md:right-40 top-13 md:top-25"
            width="30"
            height="30"
            viewBox="0 0 43 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.3128 21.4998C40.3171 22.051 40.1496 22.5898 39.8335 23.0413C39.5174 23.4929 39.0685 23.8347 38.5492 24.0194L27.8932 27.8944L24.0199 38.5487C23.829 39.063 23.4852 39.5066 23.0348 39.8198C22.5844 40.1331 22.049 40.301 21.5003 40.301C20.9517 40.301 20.4162 40.1331 19.9659 39.8198C19.5155 39.5066 19.1717 39.063 18.9808 38.5487L15.1074 27.8927L4.45151 24.0194C3.93718 23.8285 3.4936 23.4847 3.18036 23.0343C2.86712 22.5839 2.69922 22.0485 2.69922 21.4998C2.69922 20.9512 2.86712 20.4158 3.18036 19.9654C3.4936 19.515 3.93718 19.1712 4.45151 18.9803L15.1074 15.107L18.9808 4.45102C19.1717 3.93669 19.5155 3.49311 19.9659 3.17987C20.4162 2.86663 20.9517 2.69873 21.5003 2.69873C22.049 2.69873 22.5844 2.86663 23.0348 3.17987C23.4852 3.49311 23.829 3.93669 24.0199 4.45102L27.8949 15.107L38.5492 18.9803C39.0685 19.165 39.5174 19.5068 39.8335 19.9583C40.1496 20.4099 40.3171 20.9487 40.3128 21.4998Z"
              fill="#F3B675"
            />
          </svg>
          <svg
            className="absolute left-140 top-40"
            width="30"
            height="30"
            viewBox="0 0 43 43"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.3128 21.4998C40.3171 22.051 40.1496 22.5898 39.8335 23.0413C39.5174 23.4929 39.0685 23.8347 38.5492 24.0194L27.8932 27.8944L24.0199 38.5487C23.829 39.063 23.4852 39.5066 23.0348 39.8198C22.5844 40.1331 22.049 40.301 21.5003 40.301C20.9517 40.301 20.4162 40.1331 19.9659 39.8198C19.5155 39.5066 19.1717 39.063 18.9808 38.5487L15.1074 27.8927L4.45151 24.0194C3.93718 23.8285 3.4936 23.4847 3.18036 23.0343C2.86712 22.5839 2.69922 22.0485 2.69922 21.4998C2.69922 20.9512 2.86712 20.4158 3.18036 19.9654C3.4936 19.515 3.93718 19.1712 4.45151 18.9803L15.1074 15.107L18.9808 4.45102C19.1717 3.93669 19.5155 3.49311 19.9659 3.17987C20.4162 2.86663 20.9517 2.69873 21.5003 2.69873C22.049 2.69873 22.5844 2.86663 23.0348 3.17987C23.4852 3.49311 23.829 3.93669 24.0199 4.45102L27.8949 15.107L38.5492 18.9803C39.0685 19.165 39.5174 19.5068 39.8335 19.9583C40.1496 20.4099 40.3171 20.9487 40.3128 21.4998Z"
              fill="#F3B675"
            />
          </svg>

          <svg
            className="absolute top-6 md:top-10 right-10"
            width="27"
            height="27"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="13.5" cy="13.5" r="13.5" fill="#EAC4E5" />
          </svg>
          <svg
            className="absolute top-45 left-45"
            width="20"
            height="20"
            viewBox="0 0 27 27"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="13.5" cy="13.5" r="13.5" fill="#FEB4F4" />
          </svg>
        </div>
        <div
          className={
            messages
              ? "absolute z-5 text-center  top-0 left-1/2 transform -translate-x-1/2  transition-all duration-700"
              : "absolute z-5 text-center  top-20 left-1/2 transform -translate-x-1/2   transition-all duration-700"
          }
        >
          <h2
            className={
              messages
                ? "font-playfair-display w-[320px] md:w-[420px]  font-medium text-[1.5em] md:text-[2em] transition-all duration-700"
                : "font-playfair-display w-[400px] md:w-[620px] mx-auto font-medium text-[2em] md:text-[3em] transition-all duration-700"
            }
          >
            Got something on your mind? Let's talk!
          </h2>
          {messages == "" ? (
            <p className="relative z-5 text-center md:text-[1em]/7 text-[0.8em]/6 mt-4 max-w-[300px] mx-auto text-zinc-600">
              Want to talk to someone but can't wait for a response? We can help
              you solve it!
            </p>
          ) : (
            <p></p>
          )}
        </div>
        <div className={messages ? "mt-40" : "mt-100"}>
          {messages && (
            <h2 className="text-center xl:mb-45 mb-10 text-[1.2em] relative z-5 text-white mx-auto py-4 px-6 rounded-full w-fit bg-zinc-800">
              {messages}
            </h2>
          )}
          <div className="relative lg:mx-[350px] mx-[10px] ">
            <div
              onInput={(e) => handleInputChange(e)}
              ref={editableRef}
              style={{ filter: "drop-shadow(0px 2px 2px #878787)" }}
              contentEditable="true"
              className="border-2 bg-white w-full pr-20 dark:bg-black relative rounded-[25px] py-3 px-6 mt-10 editable-with-placeholder"
              data-placeholder={placeholderText}
            ></div>
            <div
              onClick={() => handlerDelete()}
              className="bg-black dark:bg-white w-fit p-[5px] absolute rounded-lg  h-fit right-4 top-2.5"
            >
              <svg
                className="text-white dark:text-black"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}