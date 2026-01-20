import { CheckCircle2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.126 0 1.051 3.309 1.923 7.709 2.125v7.372h3.913v-7.372c4.393-.202 7.694-1.073 7.694-2.125s-3.301-1.924-7.694-2.125" fill="white"/>
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">TRC20 Financial Instrument</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Точная копия оригинального USDT TRC20 с полной совместимостью и функциональностью
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Технические характеристики</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Сеть TRC20</p>
                  <p className="text-sm text-gray-600">Работает на блокчейне TRON</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Оригинальный смарт-контракт</p>
                  <p className="text-sm text-gray-600">100% копия контракта USDT TRC20</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Оригинальный знак USDT</p>
                  <p className="text-sm text-gray-600">Идентичная визуальная идентификация</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Функциональность</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Совместимость с кошельками</p>
                  <p className="text-sm text-gray-600">Работает во всех TRC20 кошельках</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Читается трекерами</p>
                  <p className="text-sm text-gray-600">Поддержка TronScan и других обозревателей</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Увеличение баланса</p>
                  <p className="text-sm text-gray-600">Полная функциональность транзакций</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Инвестиционное предложение</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Создание финансового инструмента на базе проверенной технологии TRC20 
            с полной технической совместимостью экосистемы TRON.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Инструмент обладает всеми необходимыми характеристиками для интеграции 
            в существующую инфраструктуру криптовалютных кошельков и обменников.
          </p>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          Конфиденциальная презентация
        </div>
      </div>
    </div>
  );
}
