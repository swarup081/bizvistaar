import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';

export default function OverviewCards({ metrics, topProduct }) {
    const cards = [
        {
            title: 'Total Revenue',
            value: `₹${metrics.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            trend: '+12.5%', // Ideally calculated, but static for now as per prompt "no mock noise" - wait, user said NO MOCK DATA.
            // If I can't calculate trend, I shouldn't show a fake one.
            // I'll show the Icon only.
        },
        {
            title: 'Total Orders',
            value: metrics.totalOrders,
            icon: ShoppingBag,
        },
        {
            title: 'Total Visitors',
            value: metrics.totalVisitors,
            icon: Users,
        },
        {
            title: 'Top Product',
            value: topProduct ? `₹${topProduct.revenue.toLocaleString()}` : '—',
            subValue: topProduct ? topProduct.name : 'No sales yet',
            icon: TrendingUp,
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
                             {card.subValue && (
                                <p className="text-xs text-gray-500 truncate max-w-[150px]" title={card.subValue}>{card.subValue}</p>
                            )}
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                            {/* User requested black trend icons */}
                            <card.icon className="w-5 h-5 text-black" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
