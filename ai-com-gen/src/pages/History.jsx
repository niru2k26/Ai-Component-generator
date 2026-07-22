import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";

const History = () => {
  const [historyList, setHistoryList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tab, setTab] = useState("code");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistoryList(res.data);

      if (res.data.length > 0) {
        setSelectedItem(res.data[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch history");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex px-[100px] py-[30px] gap-[20px] h-[calc(100vh-90px)] bg-[#0f0f0f] text-white">
        
        <div className="w-[35%] bg-[#141319] rounded-xl p-4 overflow-y-auto">
          <h2 className="text-[24px] font-bold mb-4 sp-text">Prompt History</h2>

          {historyList.length === 0 ? (
            <p className="text-gray-400">No history found</p>
          ) : (
            historyList.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedItem(item)}
                className={`p-4 mb-3 rounded-xl cursor-pointer border ${
                  selectedItem?._id === item._id
                    ? "border-purple-500 bg-[#1d1b25]"
                    : "border-gray-700 bg-[#09090B]"
                }`}
              >
                <p className="font-semibold line-clamp-2">{item.prompt}</p>
                <p className="text-sm text-gray-400 mt-2">{item.framework}</p>
              </div>
            ))
          )}
        </div>

        <div className="w-[65%] bg-[#141319] rounded-xl overflow-hidden">
          {selectedItem ? (
            <>
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-[20px] font-bold">Selected Prompt</h3>
                <p className="text-gray-400 mt-2">{selectedItem.prompt}</p>
              </div>

              <div className="flex">
                <button
                  onClick={() => setTab("code")}
                  className={`w-1/2 p-3 ${tab === "code" ? "bg-[#333]" : ""}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setTab("preview")}
                  className={`w-1/2 p-3 ${tab === "preview" ? "bg-[#333]" : ""}`}
                >
                  Preview
                </button>
              </div>

              <div className="h-[calc(100%-120px)]">
                {tab === "code" ? (
                  <Editor
                    value={selectedItem.code}
                    theme="vs-dark"
                    language="html"
                    height="100%"
                    options={{ readOnly: true }}
                  />
                ) : (
                  <iframe
                    srcDoc={selectedItem.code}
                    title="preview"
                    className="w-full h-full bg-white"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a history item
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default History;