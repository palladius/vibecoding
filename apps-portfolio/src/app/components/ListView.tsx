import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { Talk, Article } from '../../lib/types';

interface ListViewProps {
  items: (Talk | Article)[];
}

const ListView: React.FC<ListViewProps> = ({ items }) => {
  const currentYear = moment().year();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = moment(dateString);
    if (date.year() === currentYear) {
      return date.format('D MMM');
    } else {
      return date.format('YYYY-MM-DD');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Title</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Type</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Date</th>
            <th className="py-2 px-4 border-b border-gray-700 text-left">Tags</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-2 px-4 border-b border-gray-700">
                <Link href={item.type === 'talk' ? `/talks/${item.slug}` : `/articles/${item.slug}`} className="text-blue-400 hover:underline">
                  {item.title} {item.type === 'talk' && item.event && `@ ${item.event}`}
                </Link>
              </td>
              <td className="py-2 px-4 border-b border-gray-700">{item.type}</td>
              <td className="py-2 px-4 border-b border-gray-700">
                {formatDate('publish_date' in item ? item.publish_date : item.date)}
              </td>
              <td className="py-2 px-4 border-b border-gray-700">
                {item.tags && item.tags.split(',').map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
                  >
                    #{tag}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
