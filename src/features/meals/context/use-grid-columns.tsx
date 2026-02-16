import { useState, useEffect } from 'react';

export function useGridColumns() {
    const [columns, setColumns] = useState(1);

    useEffect(() => {
        const updateColumns = () => {
            const width = window.innerWidth;
            if (width >= 1280) setColumns(8);      // xl
            else if (width >= 1024) setColumns(8); // lg
            else if (width >= 768) setColumns(5);  // md
            else if (width >= 640) setColumns(3);  // sm
            else setColumns(1);                    // default
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    return columns;
}