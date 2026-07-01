export interface CsvHeader {
  key: string;
  label: string;
}

export function exportToCSV<T extends object>(
  data: T[],
  filename: string,
  headers: CsvHeader[],
): void {
  const headerRow = headers.map((h) => h.label).join(',');

  const dataRows = data
    .map((item) =>
      headers
        .map((h) => {
          let value = (item as Record<string, unknown>)[h.key];
          if (Array.isArray(value)) {
            value = value.map((v: { name?: string }) => v.name || v).join('; ');
          }
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"') || value.includes('\n'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        })
        .join(','),
    )
    .join('\n');

  const csv = `\uFEFF${headerRow}\n${dataRows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
