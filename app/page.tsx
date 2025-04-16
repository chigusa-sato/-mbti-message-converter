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
    <div className="container mx-auto p-4 pt-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">MBTI メッセージ変換</h1>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          メッセージを入力:
        </label>
        <textarea
          id="message"
          rows={4}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
          placeholder="ここにメッセージを入力してください..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="mbti" className="block text-sm font-medium text-gray-700 mb-1">
          相手のMBTIタイプを選択:
        </label>
        <select
          id="mbti"
          className="text-gray-800 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2 bg-white"
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

      <div className="text-center mb-6">
        <button
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={handleConvert}
          disabled={!message || isLoading}
        >
          {isLoading ? '変換中...' : '変換する'}
        </button>
      </div>

      {error && (
        <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>エラー: {error}</p>
        </div>
      )}

      {!isLoading && convertedMessage && (
        <div>
          <h2 className="text-xl font-semibold mb-2">変換結果:</h2>
          <div className="text-gray-800 bg-blue-50 p-4 rounded-md border border-blue-200 whitespace-pre-wrap">
            {convertedMessage}
          </div>
        </div>
      )}

      {isLoading && (
         <div className="text-center py-4">
           <p>AIが変換中です...</p>
         </div>
      )}
    </div>
  );
}
