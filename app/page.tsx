"use client";

import { useState } from "react";

const mbtiTypes = [
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [selectedMbti, setSelectedMbti] = useState(mbtiTypes[0]);
  const [convertedMessage, setConvertedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setIsLoading(true);
    setConvertedMessage("");
    setError(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, mbtiType: selectedMbti }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: '変換に失敗しました。サーバー側で問題が発生した可能性があります。' }));
        throw new Error(errorData.error || `エラーが発生しました: ${response.statusText}`);
      }

      const data = await response.json();
      setConvertedMessage(data.convertedMessage);

    } catch (err) {
      console.error("Conversion failed:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        MBTI メッセージ変換
      </h1>

      <div className="space-y-6">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-800 mb-1">
            メッセージを入力:
          </label>
          <textarea
            id="message"
            rows={5}
            className="shadow focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3"
            placeholder="ここにメッセージを入力してください..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="mbti" className="block text-sm font-medium text-gray-800 mb-1">
            相手のMBTIタイプを選択:
          </label>
          <select
            id="mbti"
            className="text-gray-800 shadow focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3 bg-white"
            value={selectedMbti}
            onChange={(e) => setSelectedMbti(e.target.value)}
            disabled={isLoading}
          >
            {mbtiTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-center mt-8 mb-8">
        <button
          type="button"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
          onClick={handleConvert}
          disabled={!message || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              変換中...
            </>
          ) : (
            '変換する'
          )}
        </button>
      </div>

      {error && (
        <div className="my-6 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg shadow-sm">
          <p className="font-medium">エラー:</p>
          <p>{error}</p>
        </div>
      )}

      {isLoading && (
         <div className="text-center py-6">
           <svg className="animate-spin mx-auto h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
           <p className="mt-2 text-sm text-gray-600">AIが変換中です...</p>
         </div>
      )}

      {!isLoading && convertedMessage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">変換結果:</h2>
          <div className="text-gray-800 bg-blue-50 p-4 rounded-lg border border-blue-200 whitespace-pre-wrap shadow-sm">
            {convertedMessage}
          </div>
        </div>
      )}
    </div>
  );
}
