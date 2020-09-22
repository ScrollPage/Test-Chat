import useSWR from 'swr';

export const swr = (url, iniitalData) => {
    const { data } = useSWR(url, { initialData: iniitalData });
    return data;
};
