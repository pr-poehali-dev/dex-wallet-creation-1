import { useState, useRef } from 'react';
import { CheckCircle2, Download, Shield, TrendingUp, Users, Target, BarChart3, Zap } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function App() {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!contentRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pages = contentRef.current.querySelectorAll('.presentation-page');
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        const canvas = await html2canvas(page, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      pdf.save('TRC20-Financial-Instrument-Presentation.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isDownloading ? 'Создание PDF...' : 'Скачать презентацию'}
        </button>
      </div>

      <div ref={contentRef} className="max-w-5xl mx-auto">
        <div className="presentation-page min-h-screen bg-white p-16 flex flex-col justify-center">
          <div className="text-center">
            <svg className="w-24 h-24 mx-auto mb-8" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.126 0 1.051 3.309 1.923 7.709 2.125v7.372h3.913v-7.372c4.393-.202 7.694-1.073 7.694-2.125s-3.301-1.924-7.694-2.125" fill="white"/>
            </svg>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">TRC20 Financial Instrument</h1>
            <p className="text-2xl text-gray-600 mb-8">Инвестиционная презентация</p>
            <div className="w-32 h-1 bg-green-600 mx-auto mb-12"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Точная копия оригинального USDT TRC20 с полной совместимостью и функциональностью блокчейна TRON
            </p>
            <div className="mt-16 text-sm text-gray-500">
              Конфиденциальная презентация • 2026
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Краткое резюме проекта</h2>
          
          <div className="space-y-8 mb-12">
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Суть проекта</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Создание финансового инструмента на базе проверенной технологии TRC20, 
                представляющего собой точную копию смарт-контракта USDT с полной технической 
                совместимостью экосистемы TRON.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Целевой рынок</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Интеграция в существующую инфраструктуру криптовалютных кошельков, 
                обменников и платёжных систем с аудиторией более 100 миллионов пользователей TRON.
              </p>
            </div>

            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Конкурентное преимущество</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                100% совместимость с оригинальным USDT TRC20 на уровне смарт-контракта, 
                визуальной идентификации и функциональности, что обеспечивает бесшовную 
                интеграцию без необходимости модификации существующих систем.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="bg-gray-50 p-6 rounded-xl">
              <Target className="w-10 h-10 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Точность</h4>
              <p className="text-sm text-gray-600">100% копия оригинального контракта</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Zap className="w-10 h-10 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Скорость</h4>
              <p className="text-sm text-gray-600">Мгновенные транзакции в сети TRON</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <Shield className="w-10 h-10 text-green-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Надёжность</h4>
              <p className="text-sm text-gray-600">Проверенная технология блокчейна</p>
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Технические характеристики</h2>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Блокчейн TRON (TRC20)</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Работа на одной из самых быстрых и масштабируемых блокчейн-сетей с пропускной 
                    способностью до 2000 транзакций в секунду.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Низкие комиссии (энергия TRON)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Высокая скорость подтверждения транзакций (3 секунды)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Совместимость с EVM (Ethereum Virtual Machine)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Смарт-контракт</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Точная копия оригинального смарт-контракта USDT TRC20 с адресом 
                    TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Идентичная структура кода
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Те же функции: transfer, approve, transferFrom
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Совместимость с TRC20 стандартом
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-white p-8 rounded-2xl border border-green-100">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Визуальная идентификация</h3>
                  <p className="text-lg text-gray-700 mb-4">
                    Использование оригинального символа и названия USDT для обеспечения 
                    узнаваемости и доверия пользователей.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Символ: USDT
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Десятичные знаки: 6
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      Оригинальная иконка в кошельках
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Функциональные возможности</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-green-600 transition-colors">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Универсальная совместимость</h3>
              <p className="text-gray-700 mb-6">
                Токен работает во всех кошельках и приложениях, поддерживающих TRC20 стандарт.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>TronLink, Trust Wallet, Ledger</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Binance, Huobi, OKX</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>DEX платформы (SunSwap, JustSwap)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 p-8 rounded-2xl hover:border-green-600 transition-colors">
              <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Прозрачность транзакций</h3>
              <p className="text-gray-700 mb-6">
                Полная видимость всех операций в блокчейн-обозревателях.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>TronScan — основной обозреватель</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Tronscan API для интеграции</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>История всех переводов</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-10 rounded-2xl text-white">
            <h3 className="text-3xl font-semibold mb-6">Основные операции</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                <h4 className="font-semibold text-xl mb-2">Отправка</h4>
                <p className="text-green-50">Мгновенная отправка токенов на любой TRC20 адрес с минимальными комиссиями</p>
              </div>
              <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                <h4 className="font-semibold text-xl mb-2">Получение</h4>
                <p className="text-green-50">Прием токенов на кошелёк с автоматическим обновлением баланса</p>
              </div>
              <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                <h4 className="font-semibold text-xl mb-2">Обмен</h4>
                <p className="text-green-50">Обмен на любые токены через DEX и CEX платформы</p>
              </div>
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Рыночный потенциал</h2>
          
          <div className="space-y-10">
            <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                Рынок TRON
              </h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">271M+</div>
                  <div className="text-gray-600">Всего аккаунтов</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">$60B+</div>
                  <div className="text-gray-600">TVL в сети TRON</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-600 mb-2">8.5B+</div>
                  <div className="text-gray-600">Транзакций</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-white p-8 rounded-2xl border border-purple-100">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                USDT TRC20 статистика
              </h3>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">$62B+</div>
                  <div className="text-gray-600">Объём USDT на TRON</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">~60%</div>
                  <div className="text-gray-600">Доля от всего USDT</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">$50B+</div>
                  <div className="text-gray-600">Дневной объём</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Целевые сегменты</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1.5"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Криптовалютные биржи</h4>
                    <p className="text-gray-600">Листинг на централизованных и децентрализованных платформах</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1.5"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Платёжные системы</h4>
                    <p className="text-gray-600">Интеграция в мерчант-решения и P2P платформы</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1.5"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">DeFi протоколы</h4>
                    <p className="text-gray-600">Использование в стейкинге, фарминге, кредитовании</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full mt-1.5"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Корпоративные клиенты</h4>
                    <p className="text-gray-600">Решения для международных переводов и расчётов</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Технологическая архитектура</h2>
          
          <div className="space-y-8">
            <div className="border-2 border-gray-200 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Структура смарт-контракта</h3>
              <div className="bg-gray-50 p-6 rounded-xl font-mono text-sm">
                <div className="space-y-2 text-gray-700">
                  <div><span className="text-green-600">contract</span> TetherToken <span className="text-purple-600">is</span> TRC20 {`{`}</div>
                  <div className="pl-4">
                    <span className="text-blue-600">string</span> public <span className="text-orange-600">name</span> = "Tether USD";
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-600">string</span> public <span className="text-orange-600">symbol</span> = "USDT";
                  </div>
                  <div className="pl-4">
                    <span className="text-blue-600">uint8</span> public <span className="text-orange-600">decimals</span> = 6;
                  </div>
                  <div className="pl-4 mt-4">
                    <span className="text-purple-600">function</span> <span className="text-orange-600">transfer</span>(<span className="text-blue-600">address</span> to, <span className="text-blue-600">uint256</span> amount)
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-600">function</span> <span className="text-orange-600">approve</span>(<span className="text-blue-600">address</span> spender, <span className="text-blue-600">uint256</span> amount)
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-600">function</span> <span className="text-orange-600">transferFrom</span>(<span className="text-blue-600">address</span> from, <span className="text-blue-600">address</span> to, <span className="text-blue-600">uint256</span> amount)
                  </div>
                  <div>{`}`}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border border-green-100">
                <Shield className="w-10 h-10 text-green-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Безопасность</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Аудит кода на уязвимости
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Проверенная архитектура USDT
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Защита от переполнения
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    Механизмы контроля доступа
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100">
                <Zap className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Производительность</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    До 2000 TPS в сети TRON
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Подтверждение за 3 секунды
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Минимальное потребление энергии
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Оптимизированный gas limit
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold mb-4">Интеграция</h3>
              <p className="text-gray-300 mb-6">
                Токен полностью совместим с существующими инструментами разработки и интеграции:
              </p>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="font-semibold">TronWeb</div>
                  <div className="text-sm text-gray-400">JavaScript SDK</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="font-semibold">TronGrid</div>
                  <div className="text-sm text-gray-400">API Gateway</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="font-semibold">Web3.js</div>
                  <div className="text-sm text-gray-400">Web3 Library</div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="font-semibold">TronBox</div>
                  <div className="text-sm text-gray-400">Dev Framework</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Инвестиционное предложение</h2>
          
          <div className="space-y-10">
            <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-10 rounded-2xl">
              <h3 className="text-3xl font-semibold mb-6">Предложение для инвесторов</h3>
              <p className="text-xl text-green-50 mb-8">
                Создание финансового инструмента с полной технической реализацией и 
                готовностью к немедленной интеграции в криптовалютную экосистему.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-green-50">Совместимость с USDT TRC20</div>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">271M+</div>
                  <div className="text-green-50">Потенциальная аудитория</div>
                </div>
                <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
                  <div className="text-3xl font-bold mb-2">$60B+</div>
                  <div className="text-green-50">Объём рынка</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="border-2 border-gray-200 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Ключевые преимущества</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">Готовое решение</div>
                      <div className="text-gray-600">Полностью разработанный и протестированный смарт-контракт</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">Мгновенная интеграция</div>
                      <div className="text-gray-600">Не требует модификации существующих систем</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">Масштабируемость</div>
                      <div className="text-gray-600">Инфраструктура TRON обеспечивает неограниченный рост</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold text-gray-900">Низкие издержки</div>
                      <div className="text-gray-600">Минимальные комиссии за транзакции в сети TRON</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="border-2 border-gray-200 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Этапы реализации</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                    <div>
                      <div className="font-semibold text-gray-900">Развёртывание контракта</div>
                      <div className="text-gray-600">Деплой смарт-контракта в mainnet TRON</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                    <div>
                      <div className="font-semibold text-gray-900">Верификация</div>
                      <div className="text-gray-600">Публикация и верификация кода на TronScan</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                    <div>
                      <div className="font-semibold text-gray-900">Интеграция</div>
                      <div className="text-gray-600">Добавление в кошельки и биржи</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
                    <div>
                      <div className="font-semibold text-gray-900">Запуск</div>
                      <div className="text-gray-600">Начало операционной деятельности</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Заключение</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Проект представляет собой уникальное сочетание проверенной технологии USDT TRC20 
                и готовности к немедленному запуску. Полная совместимость с существующей 
                инфраструктурой обеспечивает быстрый выход на рынок с минимальными рисками 
                и максимальной эффективностью. Инвестиция в данный проект — это инвестиция 
                в проверенную технологию с огромным рыночным потенциалом.
              </p>
            </div>
          </div>
        </div>

        <div className="presentation-page min-h-screen bg-white p-16 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-8">Контакты</h2>
            <div className="w-32 h-1 bg-green-600 mx-auto mb-12"></div>
            
            <div className="bg-gray-50 rounded-2xl p-12 max-w-2xl mx-auto mb-12">
              <p className="text-xl text-gray-700 mb-8">
                Для получения дополнительной информации и обсуждения условий инвестирования:
              </p>
              <div className="space-y-4 text-lg text-gray-600">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Конфиденциальная презентация</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>TRC20 Financial Instrument</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>2026</span>
                </div>
              </div>
            </div>

            <svg className="w-20 h-20 mx-auto opacity-50" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.126 0 1.051 3.309 1.923 7.709 2.125v7.372h3.913v-7.372c4.393-.202 7.694-1.073 7.694-2.125s-3.301-1.924-7.694-2.125" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
