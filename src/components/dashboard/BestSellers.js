import React from "react";
import { ShoppingBag } from "lucide-react";

const bestSellers = [
  {
    id: 1,
    name: "Nike Air Zoom Pegasus 40",
    units: 67,
    amount: "$5,600",
    image: null,
  },
  {
    id: 2,
    name: "Nike ZoomX",
    units: 42,
    amount: "$4,860",
    image: null,
  },
  {
    id: 3,
    name: "Adidas Ultraboost Light",
    units: 35,
    amount: "$3,850",
    image: null,
  },
];

export default function BestSellers() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-gray-900 font-sans">Top 3 Best Sellers</h3>
      <div className="flex flex-col gap-6">
        {bestSellers.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-gray-900 font-sans leading-tight">{item.name}</h4>
              <p className="text-xs font-medium text-gray-500 font-sans">
                {item.units} Units Sold - <span className="text-gray-900">{item.amount}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
