import React, { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export const Table = ({ className = '', children, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className="overflow-x-auto w-full">
    <table className={`w-full text-left border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ className = '', children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={`border-b border-border bg-table text-xs uppercase tracking-wider text-text-secondary font-bold ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ className = '', children, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={`divide-y divide-border ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ className = '', children, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={`transition-colors hover:bg-table ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ className = '', children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell = ({ className = '', children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </td>
);
