import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BiDotsVerticalRounded, BiSolidVolumeMute } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import { VscCopy } from "react-icons/vsc";
import ReactTyped from "react-typed";
import values from "../values";
import Audio from "./Audio";

export default function Chatbot() {
  const body = useRef();
  const [chatData, setChatData] = useState([]);
  const [inputData, setInputData] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const { url, data } = values;
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (inputData) {
      setChatData((prev) => {
        return [...prev, { message: inputData, user: true }];
      });
      setIsloading(true);

      axios
        .post(`${url}/session/open`, data)
        .then((d) => {
          axios
            .post(`${url}/session/${d.data.sessionId}/message`, {
              message: inputData,
            })
            .then((d2) => {
              axios
                .get(`${url}/events/${data?.serverId}`)
                .then((d3) => {
                  let text = "";
                  d3.data.forEach((item) => {
                    if (item.type === "text" && item.type !== " ") {
                      if (item.text) {
                        text += item.text;
                      }
                    }
                  });
                  if (text) {
                    if (!isAudio) {
                      setIsloading(false);
                      setChatData((prev) => {
                        return [...prev, { message: text }];
                      });
                    } else if (isAudio) {
                      axios
                        .post(
                          `https://jymjsykl31.execute-api.us-east-1.amazonaws.com/v1/text2speech`,
                          {
                            text,
                            voice_id: "Joanna",
                          }
                        )
                        .then((d4) => {
                          setChatData((prev) => {
                            return [...prev, { audio: true, url: d4.data.url }];
                          });
                          setIsAudio(false);
                        })
                        .catch((e) => {
                          console.log;
                          setIsloading(false);
                        });
                    }
                    axios
                      .get(`${url}/session/${d.data.sessionId}/close`)
                      .then((d1) => {
                        setIsloading(false);
                        console.log;
                      })
                      .catch((e) => {
                        setIsloading(false);
                        console.log(e);
                      });
                  }
                })
                .catch((e) => {
                  setIsloading(false);
                  console.log(e);
                });
            })
            .catch((e) => {
              setIsloading(false);
              console.log(e);
            });
        })
        .catch((e) => {
          setIsloading(false);
          axios
            .get(`${url}/session/closeall/-1`)
            .then((d) => {
              console.log;
            })
            .catch((e) => {
              console.log(e);
            });
          console.log(e);
        });
    }
    setInputData("");
  };

  const inputHandler = (e) => {
    setInputData(e.target.value);
  };

  const scrollToBottom = () => {
    body.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <div className="chatbot">
      <div className="chatbot-head">
        <div className="img">
          <img
            src="https://consultantai.co/wp-content/uploads/2022/12/prod_img_5.jpg"
            alt=""
          />
        </div>
        <div className="info">
          <h4>Anna a It Consultant</h4>
        </div>
      </div>
      <div className="chatbot-body-wrp">
        <div className="chatbot-body" ref={body}>
          {chatData?.map((data, i) => {
            return (
              <div
                key={i}
                className={`chatbot-body-item ${(data?.user && "user") || ""}`}
              >
                <div className="img">
                  {(!data?.user && (
                    <img
                      src="https://consultantai.co/wp-content/uploads/2022/12/prod_img_5.jpg"
                      alt=""
                    />
                  )) ||
                    "U"}
                </div>
                <div className="info">
                  {(!data.user && data.audio && <Audio url={data.url} />) || (
                    <p className="">
                      {(!data.user && (
                        <ReactTyped
                          strings={[data.message]}
                          typeSpeed={100}
                          backSpeed={100}
                          cursorChar=""
                        />
                      )) ||
                        data.message}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="chat-bubble chatbot-body-item ">
              <div className="typing">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chatbot-footer">
        <div className="form">
          <form
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <input
              type="text"
              ref={inputRef}
              onChange={(e) => {
                inputHandler(e);
              }}
              placeholder="Message anna It consaltant"
              value={inputData}
            />
            <button>
              <IoSend />
            </button>
          </form>
        </div>
        <div className="buttons">
          <button
            onClick={() => {
              setIsAudio(!isAudio);
            }}
            className={(isAudio && "active") || ""}
          >
            <BiSolidVolumeMute />
          </button>{" "}
          <button
            onClick={() => {
              setInputData("");
            }}
          >
            <MdRestartAlt />
          </button>
          <button
            onClick={() => {
              inputRef.current.select();
              document.execCommand("copy");
            }}
          >
            <VscCopy />
          </button>{" "}
          <button>
            <BiDotsVerticalRounded />
          </button>
        </div>
      </div>
    </div>
  );
}
