import React, { useState } from 'react';
import { Search, Recycle } from 'lucide-react';

// 垃圾分类数据库
const wasteDatabase = {
  // 可回收物
  recyclable: ['纸张', '塑料瓶', '玻璃瓶', '金属罐', '报纸', '纸板', '书本', '衣物'],
  // 有害垃圾
  hazardous: ['电池', '灯管', '药品', '油漆', '化妆品', '农药', '水银温度计'],
  // 厨余垃圾
  food: ['果皮', '剩饭', '茶叶', '骨头', '菜叶', '咖啡渣', '蛋壳', '过期食品'],
  // 其他垃圾
  other: ['烟头', '尘土', '陶瓷', '卫生纸', '纸尿裤', '口香糖', '橡皮泥']
};

function getWasteType(waste: string): string {
  for (const [type, items] of Object.entries(wasteDatabase)) {
    if (items.some(item => waste.includes(item))) {
      switch (type) {
        case 'recyclable':
          return '可回收物';
        case 'hazardous':
          return '有害垃圾';
        case 'food':
          return '厨余垃圾';
        case 'other':
          return '其他垃圾';
      }
    }
  }
  return '未知类型';
}

function getTypeColor(type: string): string {
  switch (type) {
    case '可回收物':
      return 'bg-blue-100 text-blue-800';
    case '有害垃圾':
      return 'bg-red-100 text-red-800';
    case '厨余垃圾':
      return 'bg-green-100 text-green-800';
    case '其他垃圾':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-yellow-100 text-yellow-800';
  }
}

function App() {
  const [waste, setWaste] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waste.trim()) {
      setResult(getWasteType(waste.trim()));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <Recycle className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">垃圾分类助手</h2>
          <p className="mt-2 text-sm text-gray-600">
            输入垃圾名称，快速查询其分类类别
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <div className="rounded-md shadow-sm relative">
            <input
              type="text"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
              placeholder="请输入垃圾名称"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
            >
              <Search className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-8 text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">分类结果：</div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-medium ${getTypeColor(result)}`}>
              {result}
            </span>
            {result === '未知类型' && (
              <p className="mt-2 text-sm text-gray-500">
                抱歉，未能找到该物品的分类信息。请咨询当地垃圾分类指南。
              </p>
            )}
          </div>
        )}

        <div className="mt-12">
          <h3 className="text-lg font-medium text-gray-900 mb-4">垃圾分类指南</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-800">可回收物</h4>
              <p className="text-sm text-blue-600 mt-1">纸张、塑料、金属、玻璃等可循环利用的物品</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800">有害垃圾</h4>
              <p className="text-sm text-red-600 mt-1">电池、灯管、药品等对环境有害的物品</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50">
              <h4 className="font-medium text-green-800">厨余垃圾</h4>
              <p className="text-sm text-green-600 mt-1">剩菜剩饭、果皮等易腐烂的生物质废物</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-800">其他垃圾</h4>
              <p className="text-sm text-gray-600 mt-1">不能归类于上述类别的其他生活废弃物</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;