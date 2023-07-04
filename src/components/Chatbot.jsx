import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  BiDotsVerticalRounded,
  BiSolidMicrophone,
  BiSolidVolumeMute,
} from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { MdRestartAlt } from "react-icons/md";
import { VscCopy } from "react-icons/vsc";
import values from "../values";

export default function Chatbot() {
  const body = useRef();
  const [chatData, setChatData] = useState([]);
  const [inputData, setInputData] = useState("");
  const { url, data } = values;

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (inputData) {
      setChatData((prev) => {
        return [...prev, { message: inputData, user: true }];
      });

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
                  console.log(d3.data);
                  d3.data.forEach((item) => {
                    if (item.type === "text") {
                      if (item.text) {
                        setChatData((prev) => {
                          return [...prev, { message: item.text }];
                        });
                      }
                    }
                  });
                  axios
                    .get(`${url}/session/${d.data.sessionId}/close`)
                    .then((d1) => {
                      console.log(d1);
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
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
          {chatData?.map((data, i) => (
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
                <p>{data.message} </p>
              </div>
            </div>
          ))}
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
          <button>
            <BiSolidVolumeMute />
          </button>{" "}
          <button>
            <MdRestartAlt />
          </button>
          <button>
            <BiSolidMicrophone />
          </button>
          <button>
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
