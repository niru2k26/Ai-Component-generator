import { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from '@google/genai';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import axios from 'axios';

const Home = () => {

    const options = [
        { value: 'html-css', label: 'HTML + CSS' },
        { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
        { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
        { value: 'html-css-js', label: 'HTML + CSS + JS' },
        { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind CSS + Bootstrap' },
    ];

    const [outputScreen, setOutputScreen] = useState(false);
    const [tab, setTab] = useState(1);
    const [prompt, setPrompt] = useState("");
    const [frameWork, setFrameWork] = useState(options[0]);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const ai = new GoogleGenAI({ apiKey: "/*API KEY MENTION HERE*/ " });

    function extractCode(response) {
        const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
        return match ? match[1].trim() : response.trim();
    }

    function getFrameworkPrompt() {
        switch (frameWork.value) {
            case 'html-css':
                return `Use pure HTML and internal CSS only. No external libraries.`;
            case 'html-tailwind':
                return `Use Tailwind CSS CDN and Tailwind classes.`;
            case 'html-bootstrap':
                return `Use Bootstrap 5 CDN and Bootstrap classes.`;
            case 'html-css-js':
                return `Use HTML, internal CSS, and JavaScript.`;
            case 'html-tailwind-bootstrap':
                return `Use both Tailwind CSS and Bootstrap CDN.`;
            default:
                return '';
        }
    }

    const saveHistory = async (generatedCode) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            await axios.post(
                "http://localhost:5000/api/history/save",
                {
                    prompt,
                    framework: frameWork.label,
                    code: generatedCode,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (error) {
            console.error("Failed to save history:", error);
            toast.error("Generated code, but history was not saved");
        }
    };

    async function getResponse() {
        if (!prompt.trim()) {
            toast.error("Please enter a prompt");
            return;
        }

        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `
Generate a complete working UI.

User Requirement: ${prompt}
Framework: ${frameWork.label}

Rules:
- Return FULL working code in ONE HTML file
- Include CDN links if needed
- Add proper structure (html, head, body)
- Make it responsive and modern UI
- ${getFrameworkPrompt()}

Return ONLY code inside markdown block.
                `,
            });

            const result = extractCode(response.text);
            setCode(result);
            setOutputScreen(true);

            await saveHistory(result);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    const copyCode = async () => {
        try {
            await navigator.clipboard.writeText(code);
            toast.success("Code copied");
        } catch {
            toast.error("Copy failed");
        }
    };

    const downloadFile = () => {
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = "GenUI-Code.html";
        link.click();
        URL.revokeObjectURL(url);
        toast.success("Downloaded");
    };

    const openInNewTab = () => {
        if (!code) return;
        const newWindow = window.open("", "_blank");
        newWindow.document.write(code);
        newWindow.document.close();
    };

    const refreshPreview = () => {
        setTab(1);
        setTimeout(() => setTab(2), 100);
        toast.success("Preview refreshed");
    };

    const resetAll = () => {
        setPrompt("");
        setCode("");
        setOutputScreen(false);
        setTab(1);
        toast.info("Reset successful");
    };

    return (
        <>
            <Navbar />

            <div className="flex items-center px-[100px] justify-between gap-[30px]">

                <div className="w-[50%] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">

                    <h3 className='text-[25px] font-semibold sp-text'>
                        AI Component Generator
                    </h3>

                    <p className='text-gray-400 mt-2'>
                        Describe your component and AI will generate it
                    </p>

                    <p className='mt-4 font-bold'>Framework</p>

                    <Select
                        className='mt-2'
                        options={options}
                        value={frameWork}
                        onChange={(e) => setFrameWork(e)}
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: "#111",
                                borderColor: "#333",
                                color: "#fff",
                                boxShadow: "none",
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#111",
                                color: "#fff",
                            }),
                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused ? "#333" : "#111",
                                color: "#fff",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "#fff",
                            }),
                            placeholder: (base) => ({
                                ...base,
                                color: "#aaa",
                            }),
                            input: (base) => ({
                                ...base,
                                color: "#fff",
                            }),
                        }}
                    />

                    <p className='mt-5 font-bold'>Describe your component</p>

                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className='w-full min-h-[200px] rounded-xl bg-[#09090B] mt-3 p-[10px]'
                        placeholder="Describe your component..."
                    />

                    <div className="flex justify-between mt-3">

                        <button
                            onClick={getResponse}
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-purple-600 hover:opacity-80 disabled:opacity-50"
                        >
                            {loading ? <ClipLoader size={20} color="white" /> : <BsStars />}
                            Generate
                        </button>

                        <button
                            onClick={resetAll}
                            className="px-4 py-2 bg-gray-700 rounded-lg"
                        >
                            Reset
                        </button>

                    </div>
                </div>

                <div className="w-[50%] h-[80vh] bg-[#141319] rounded-xl">

                    {!outputScreen ? (
                        <div className="h-full flex flex-col justify-center items-center">
                            <HiOutlineCode size={40} />
                            <p className="text-gray-400 mt-3">Output appears here</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex">
                                <button onClick={() => setTab(1)} className={`w-1/2 p-3 ${tab === 1 ? "bg-[#333]" : ""}`}>Code</button>
                                <button onClick={() => setTab(2)} className={`w-1/2 p-3 ${tab === 2 ? "bg-[#333]" : ""}`}>Preview</button>
                            </div>

                            <div className="flex justify-end gap-3 p-3">
                                {tab === 1 ? (
                                    <>
                                        <button onClick={copyCode}><IoCopy /></button>
                                        <button onClick={downloadFile}><PiExportBold /></button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={openInNewTab}><ImNewTab /></button>
                                        <button onClick={refreshPreview}><FiRefreshCcw /></button>
                                    </>
                                )}
                            </div>

                            {tab === 1 ? (
                                <Editor
                                    value={code}
                                    onChange={(value) => setCode(value || "")}
                                    theme='vs-dark'
                                    language="html"
                                    height="100%"
                                />
                            ) : (
                                <iframe key={code} srcDoc={code} className="w-full h-full bg-white" />
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home;
