import React, { useState, useEffect } from 'react';
import { Info, Droplets, TrendingDown, Link as LinkIcon, RefreshCw, AlertCircle, ArrowUpDown, X, Check, Target, CircleDollarSign, Crosshair, ListTodo, CheckCircle } from 'lucide-react';

// 內嵌 CSS 處理動態波浪與自訂 Checkbox 動畫
const styles = `
  @keyframes wave-slide {
    0% { background-position-x: 0; }
    100% { background-position-x: -400px; }
  }
  .glass-sphere {
    box-shadow: inset -3px -3px 10px rgba(0,0,0,0.05), inset 2px 2px 5px rgba(255,255,255,0.3);
  }
  .wave-2025 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 40'%3E%3Cpath d='M 0 20 Q 100 0 200 20 T 400 20 L 400 40 L 0 40 Z' fill='%2393c5fd'/%3E%3C/svg%3E");
    background-size: 400px 40px;
    animation: wave-slide 3s linear infinite;
  }
  .wave-2022 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 40'%3E%3Cpath d='M 0 20 Q 100 0 200 20 T 400 20 L 400 40 L 0 40 Z' fill='%2314b8a6'/%3E%3C/svg%3E");
    background-size: 400px 40px;
    animation: wave-slide 3.5s linear infinite;
  }
  
  /* 自訂典雅勾選框 */
  .elegant-checkbox input:checked + div {
    background-color: #3b82f6;
    border-color: #3b82f6;
  }
  .elegant-checkbox input:checked + div svg {
    opacity: 1;
    transform: scale(1);
  }
`;

// 備用模擬數據
const fallbackData = [
  { ticker: "VOO", currentPrice: 582.96, dd2026: -8.9, dd2025: -19.0, dd2022: -25.4 },
  { ticker: "00675L", currentPrice: 85.30, dd2026: -14.9, dd2025: -55.2, dd2022: -64.0 }, 
  { ticker: "MSFT", currentPrice: 420.55, dd2026: -35.0, dd2025: -17.5, dd2022: -34.4 }
].map(item => ({
  ...item,
  prog25: (item.dd2026 / item.dd2025) * 100,
  prog22: (item.dd2026 / item.dd2022) * 100
}));

const parseCSVLine = (text) => {
  let result = [];
  let inQuotes = false;
  let currentWord = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === ',' && !inQuotes) {
      result.push(currentWord.trim());
      currentWord = '';
    } else {
      currentWord += char;
    }
  }
  result.push(currentWord.trim());
  return result;
};

// 非線性映射函數
const mapProgressToVisualHeight = (p) => {
  if (p <= 0) return 0;
  if (p > 100) return 105; 
  if (p <= 50) return (p / 50) * 25;
  if (p <= 66.7) return 25 + ((p - 50) / (66.7 - 50)) * 25;
  if (p <= 83.3) return 50 + ((p - 66.7) / (83.3 - 66.7)) * 25;
  return 75 + ((p - 83.3) / (100 - 83.3)) * 25;
};

// 玻璃球組件
const GlassSphere = ({ progress, label, type, mdd, sortMode, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, [progress]);

  const visualHeight = mapProgressToVisualHeight(progress);
  
  const is2025 = type === '2025';
  const waveClass = is2025 ? 'wave-2025' : 'wave-2022';
  const bodyColor = is2025 ? 'bg-blue-300' : 'bg-teal-500';
  const titleColor = is2025 ? 'text-blue-600' : 'text-teal-700';
  
  const isOverfilled = progress >= 100;

  // 排序模式動態縮放
  let containerScaleClass = "scale-100 opacity-100";
  if (sortMode === 1) {
    containerScaleClass = is2025 ? "scale-110 opacity-100 z-10" : "scale-90 opacity-60 grayscale-[20%]";
  } else if (sortMode === 2) {
    containerScaleClass = !is2025 ? "scale-110 opacity-100 z-10" : "scale-90 opacity-60 grayscale-[20%]";
  }

  return (
    <div 
      className={`flex flex-col items-center gap-1 sm:gap-2 transition-all duration-500 ease-out origin-center ${containerScaleClass} cursor-pointer hover:scale-105`}
      onClick={onClick}
    >
      <span className={`text-[10px] sm:text-xs font-bold tracking-wider ${titleColor}`}>
        {label}
      </span>
      
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[2.5px] sm:border-[3px] border-slate-700 relative overflow-hidden bg-slate-50 glass-sphere transition-colors duration-500 shadow-md">
        
        {/* 等分橫線 */}
        <div className="absolute w-full border-b-[1.5px] border-slate-800/30 z-10" style={{ bottom: '75.0%' }}></div>
        <div className="absolute w-full border-b-[1.5px] border-slate-800/40 z-10" style={{ bottom: '50.0%' }}></div>
        <div className="absolute w-full border-b-[1.5px] border-slate-800/20 z-10" style={{ bottom: '25.0%' }}></div>

        {/* 動態水位容器 */}
        <div 
          className="absolute bottom-0 left-0 w-full transition-all duration-[1500ms] ease-out flex flex-col justify-end z-0"
          style={{ height: loaded ? `${visualHeight}%` : '0%' }}
        >
          <div className={`w-full h-[20px] sm:h-[30px] ${waveClass} absolute -top-[12px] sm:-top-[18px] left-0 opacity-90`}></div>
          <div className={`w-full h-full ${bodyColor} opacity-90`}></div>
        </div>

        {/* 破裂特效 */}
        {isOverfilled && (
          <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none drop-shadow-md" viewBox="0 0 100 100">
            <path d="M 45 0 L 35 25 L 60 50 L 35 75 L 45 100" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="miter"/>
            <path d="M 60 50 L 90 40" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 35 25 L 10 15" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 35 75 L 15 85" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}

        {/* 進度標示 */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <span className={`font-black text-sm sm:text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-white`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <span className="text-[9px] sm:text-xs font-bold text-slate-400 bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded sm:rounded-md mt-0.5 sm:mt-1">
        MDD {Math.round(mdd)}%
      </span>
    </div>
  );
};

// --- 懸浮視窗組件 (Target Modal) ---
const ExecutionModal = ({ isOpen, onClose, data, checks, onToggleCheck }) => {
  if (!isOpen || !data) return null;

  const { ticker, currentPrice, currentDD, baseDD, label } = data;
  const targets = [50, 66.7, 83.3, 100];
  
  // 決定標籤顏色 (實心淺底 + 深色字)
  const is2025 = label === '2025/4';
  const badgeClass = is2025 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-teal-100 text-teal-800';
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl relative z-10 overflow-hidden transform transition-all">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="pt-8 pb-6 px-6 text-center">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-3">
            {ticker.replace('TPE:', '')}
            {/* 實心塗色、深色字體的標籤設計 */}
            <span className={`text-sm font-black px-3 py-1 rounded-xl shadow-sm tracking-wide ${badgeClass}`}>
              {label}
            </span>
          </h2>
          <div className="inline-flex items-center justify-center gap-1.5 mt-4 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <CircleDollarSign className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-bold text-slate-500 mt-0.5">現價</span>
            <span className="text-xl font-black text-slate-800 ml-1">
              {currentPrice > 0 ? currentPrice.toFixed(2) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="px-6 pb-8">
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm sm:text-base">
              <thead>
                <tr className="bg-[#4a6b9c] text-white/90 text-xs sm:text-sm tracking-wider">
                  <th className="py-3 px-2 text-center font-bold w-1/4">
                    <div className="flex flex-col items-center gap-1">
                      <Target className="w-4 h-4 text-blue-200" />
                      達成%
                    </div>
                  </th>
                  <th className="py-3 px-2 text-center font-bold w-1/4">
                    <div className="flex flex-col items-center gap-1">
                      <TrendingDown className="w-4 h-4 text-blue-200" />
                      目標跌幅
                    </div>
                  </th>
                  <th className="py-3 px-2 text-center font-bold w-1/4">
                    <div className="flex flex-col items-center gap-1">
                      <Crosshair className="w-4 h-4 text-blue-200" />
                      目標價
                    </div>
                  </th>
                  <th className="py-3 px-2 text-center font-bold w-1/4">
                    <div className="flex flex-col items-center gap-1">
                      <ListTodo className="w-4 h-4 text-blue-200" />
                      已執行
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-50">
                {targets.map((percent, idx) => {
                  const targetDD = baseDD * (percent / 100);
                  
                  let targetPrice = 0;
                  if (currentPrice > 0) {
                    const peakPrice = currentPrice / (1 + (currentDD / 100));
                    targetPrice = peakPrice * (1 + (targetDD / 100));
                  }

                  const checkId = `${ticker}-${label}-${percent}`;
                  const isChecked = !!checks[checkId];

                  return (
                    <tr key={percent} className={`border-t border-slate-200 transition-colors ${isChecked ? 'bg-blue-50/50' : 'hover:bg-slate-100/50'}`}>
                      <td className="py-3.5 px-2 text-center font-bold text-slate-700">{percent}%</td>
                      <td className="py-3.5 px-2 text-center font-medium text-slate-600">{targetDD.toFixed(1)}%</td>
                      <td className="py-3.5 px-2 text-center font-black text-slate-800 tracking-tight">
                        {targetPrice > 0 ? targetPrice.toFixed(2) : '-'}
                      </td>
                      <td className="py-3.5 px-2 flex justify-center items-center">
                        <label className="elegant-checkbox relative cursor-pointer flex items-center justify-center w-6 h-6">
                          <input 
                            type="checkbox" 
                            className="peer sr-only"
                            checked={isChecked}
                            onChange={() => onToggleCheck(checkId)}
                          />
                          <div className="w-6 h-6 border-2 border-slate-300 rounded-[6px] bg-white transition-all peer-hover:border-blue-400 flex items-center justify-center shadow-sm">
                            <Check className="w-4 h-4 text-white opacity-0 transform scale-50 transition-all duration-200 stroke-[3]" />
                          </div>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};


export default function App() {
  const defaultUrl = 'https://script.google.com/macros/s/AKfycbzc659ptYc81-Gb24ws_8ZFDzRQ5yks-zmGNxoHFwJH5ZhIamVYHCp7yjZsewE0IMbHEQ/exec';
  
  const [data, setData] = useState(fallbackData);
  const [csvUrl, setCsvUrl] = useState(defaultUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [sortMode, setSortMode] = useState(0);
  const [modalData, setModalData] = useState(null);

  const [checks, setChecks] = useState(() => {
    try {
      const saved = localStorage.getItem('mdd-dashboard-checks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('mdd-dashboard-checks', JSON.stringify(checks));
  }, [checks]);

  const handleToggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchData(defaultUrl);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (urlToFetch = csvUrl) => {
    if (!urlToFetch) {
      setError('請輸入來源連結');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const separator = urlToFetch.includes('?') ? '&' : '?';
      const noCacheUrl = `${urlToFetch}${separator}t=${new Date().getTime()}`;
      
      const response = await fetch(noCacheUrl);
      if (!response.ok) throw new Error('網路連線失敗，請確認連結是否正確');
      
      const responseText = await response.text();
      let rows = [];
      
      try {
        rows = JSON.parse(responseText);
      } catch (e) {
        const lines = responseText.split('\n').filter(line => line.trim() !== '');
        rows = lines.map(line => parseCSVLine(line));
      }

      if (!rows || rows.length <= 1) throw new Error('無法讀取數據，請確認來源格式');

      const parsedData = rows.slice(1).map(values => {
        const parsePercent = (val) => {
          if (!val || val === 'N/A' || val.toString().includes('#')) return 0;
          return parseFloat(val.toString().replace('%', ''));
        };

        const ticker = values[0];
        const currentPrice = values[1] ? parseFloat(values[1].toString().replace(/,/g, '')) : 0;
        
        const dd2022 = parsePercent(values[6]); 
        const dd2025 = parsePercent(values[11]);
        const dd2026 = parsePercent(values[16]);

        return {
          ticker: ticker,
          currentPrice: isNaN(currentPrice) ? 0 : currentPrice,
          dd2022: dd2022,
          dd2025: dd2025,
          dd2026: dd2026,
          prog25: dd2025 !== 0 ? (dd2026 / dd2025) * 100 : 0,
          prog22: dd2022 !== 0 ? (dd2026 / dd2022) * 100 : 0
        };
      }).filter(item => item.ticker && item.ticker !== '標的');

      setData(parsedData);
      setSortMode(0);
      
    } catch (err) {
      setError(err.message || '讀取資料時發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  // 💡 智慧即時計算「下一目標價」(過濾掉已打勾的，並找出未執行的最高價位)
  const getNextTarget = (item, checksState) => {
    if (!item.currentPrice || item.currentPrice <= 0) return null;
    
    // 推算最高點
    const peak = item.currentPrice / (1 + (item.dd2026 / 100));
    const percents = [50, 66.7, 83.3, 100];
    let allTargets = [];

    // 將 2025 與 2022 共 8 個目標價與打勾狀態綁定
    percents.forEach(p => {
      if (item.dd2025 < 0) {
        const checkId = `${item.ticker}-2025/4-${p}`;
        allTargets.push({
          type: '2025',
          percent: p,
          price: peak * (1 + (item.dd2025 * (p / 100) / 100)),
          isChecked: !!checksState[checkId]
        });
      }
      if (item.dd2022 < 0) {
        const checkId = `${item.ticker}-2022/10-${p}`;
        allTargets.push({
          type: '2022',
          percent: p,
          price: peak * (1 + (item.dd2022 * (p / 100) / 100)),
          isChecked: !!checksState[checkId]
        });
      }
    });

    // 過濾掉已經打勾執行的目標
    const uncheckedTargets = allTargets.filter(t => !t.isChecked);

    // 如果所有有效目標都已經打勾了
    if (uncheckedTargets.length === 0 && allTargets.length > 0) return 'ALL_COMPLETED';
    if (uncheckedTargets.length === 0) return null;

    // 將尚未執行的目標由高至低排序 (跌幅最淺、最先會碰到的放最前面)
    uncheckedTargets.sort((a, b) => b.price - a.price);

    // 回傳最優先的未執行目標
    return uncheckedTargets[0];
  };

  const getSortedData = () => {
    if (sortMode === 1) return [...data].sort((a, b) => b.prog25 - a.prog25);
    if (sortMode === 2) return [...data].sort((a, b) => b.prog22 - a.prog22);
    return data; 
  };

  const displayData = getSortedData();

  return (
    <div className="min-h-screen bg-slate-900 p-3 sm:p-6 md:p-8 font-sans pb-16 transition-colors duration-300">
      <style>{styles}</style>
      
      {/* 執行紀錄懸浮視窗 */}
      <ExecutionModal 
        isOpen={!!modalData} 
        onClose={() => setModalData(null)} 
        data={modalData}
        checks={checks}
        onToggleCheck={handleToggleCheck}
      />

      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2 sm:gap-3">
            <Droplets className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8" />
            股市 MDD 戰情室
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1 sm:mt-2 font-medium">即時連線 Google Sheet，追蹤加碼水位 🎯</p>
        </div>

        <div className="bg-[#fef3c7] border border-[#fde68a] rounded-xl p-3 sm:p-4 shadow-sm max-w-sm transform rotate-1 hover:rotate-0 transition-transform relative hidden md:block">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-red-400/20 rounded-full"></div>
          <p className="text-slate-800 font-bold flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-0.5" />
            <span>備註：點擊彩色玻璃球，即可開啟專屬的「加碼執行紀錄表」，系統會自動幫您推算加碼目標價！</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-6 sm:mb-8 bg-slate-800 p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-700">
        <label className="block text-xs sm:text-sm font-bold text-slate-300 mb-2 flex items-center gap-1 sm:gap-2">
          <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
          輸入即時 API 或 CSV 連結 (強烈推薦使用 Apps Script 以達 0 延遲)
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input 
            type="text" 
            value={csvUrl}
            onChange={(e) => setCsvUrl(e.target.value)}
            className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base bg-slate-900 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-200 font-medium"
          />
          <button 
            onClick={() => fetchData(csvUrl)}
            disabled={isLoading}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shrink-0 shadow-sm"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />}
            {isLoading ? '同步中...' : '同步資料'}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-rose-400 text-xs sm:text-sm font-bold bg-rose-900/40 p-2 sm:p-3 rounded-lg border border-rose-800/50">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto flex justify-end mb-3 sm:mb-4 px-1">
        <button 
          onClick={() => setSortMode(prev => (prev + 1) % 3)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-xs sm:text-sm font-bold text-slate-300 transition-all shadow-sm active:scale-95"
        >
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          {sortMode === 0 && "預設排序 (依試算表)"}
          {sortMode === 1 && <span className="text-blue-400">排序：2025/4 達成率最高</span>}
          {sortMode === 2 && <span className="text-teal-400">排序：2022/10 達成率最高</span>}
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {displayData.map((item, index) => {
          const displayTicker = item.ticker.replace('TPE:', '');
          const isLongTicker = displayTicker.length > 4;
          
          // 💡 傳入 checks 狀態讓系統判斷哪個還沒打勾
          const nextTarget = getNextTarget(item, checks);

          return (
            <div 
              key={`${item.ticker}-${index}`}
              className="bg-white rounded-[1.2rem] sm:rounded-[2rem] p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-between items-center gap-2 mb-4 sm:mb-5">
                <div className="flex flex-col justify-center min-w-0">
                  <span 
                    className={`font-black text-slate-800 truncate ${isLongTicker ? 'text-[15px] sm:text-2xl md:text-3xl tracking-tighter' : 'text-lg sm:text-3xl md:text-4xl tracking-tight'}`} 
                    title={displayTicker}
                  >
                    {displayTicker}
                  </span>
                  {/* 新增：將現價直接顯示在標的名稱正下方 */}
                  <span className="text-[11px] sm:text-sm font-bold text-slate-500 mt-0.5 truncate">
                    現價 {item.currentPrice > 0 ? item.currentPrice.toFixed(2) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-widest mb-0.5">
                    2026 DD%
                  </span>
                  <div className="flex items-center gap-0.5 sm:gap-1 bg-rose-50 px-1.5 py-1 sm:px-2 sm:py-1 rounded-md">
                    <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500" />
                    <span className="text-sm sm:text-lg font-bold text-rose-500">{item.dd2026.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col mt-auto">
                <div className="flex gap-2 sm:gap-5 justify-center mb-4">
                  <GlassSphere 
                    progress={item.prog25} 
                    label="2025/4" 
                    type="2025" 
                    mdd={item.dd2025} 
                    sortMode={sortMode}
                    onClick={() => setModalData({
                      ticker: item.ticker,
                      currentPrice: item.currentPrice,
                      currentDD: item.dd2026,
                      baseDD: item.dd2025,
                      label: '2025/4'
                    })} 
                  />
                  <GlassSphere 
                    progress={item.prog22} 
                    label="2022/10" 
                    type="2022" 
                    mdd={item.dd2022} 
                    sortMode={sortMode}
                    onClick={() => setModalData({
                      ticker: item.ticker,
                      currentPrice: item.currentPrice,
                      currentDD: item.dd2026,
                      baseDD: item.dd2022,
                      label: '2022/10'
                    })} 
                  />
                </div>
                
                {/* 💡 全新 NEXT 雙行橫幅設計 */}
                {nextTarget === 'ALL_COMPLETED' ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5 flex items-center justify-center shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] gap-2 mt-1">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                    <span className="text-sm sm:text-base font-bold text-emerald-700 tracking-tight">全部達標</span>
                  </div>
                ) : nextTarget ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 sm:px-3 sm:py-2 flex items-center justify-between shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] mt-1">
                    {/* 左側三行置中區塊：NEXT + 2025/04 + 50% */}
                    <div className="flex flex-col items-center justify-center min-w-[64px] sm:min-w-[72px] shrink-0">
                      <span className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">NEXT</span>
                      <div className={`flex flex-col items-center justify-center px-2 py-1 rounded-md w-full ${nextTarget.type === '2025' ? 'bg-blue-100 text-blue-800' : 'bg-teal-100 text-teal-800'}`}>
                        <span className="text-[9px] sm:text-[10px] font-bold leading-tight tracking-wider">
                          {nextTarget.type === '2025' ? '2025/04' : '2022/10'}
                        </span>
                        <span className="text-[11px] sm:text-xs font-black leading-tight mt-0.5">
                          {nextTarget.percent}%
                        </span>
                      </div>
                    </div>
                    {/* 右側目標價放大並置中偏右 */}
                    <div className="flex items-center pl-2">
                      <span className="text-xl sm:text-2xl font-black text-slate-700 tracking-tight">
                        {nextTarget.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}