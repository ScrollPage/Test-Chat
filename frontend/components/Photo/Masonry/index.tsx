import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore: Unreachable code error
import { useEventListener } from 'hooks';
import { Col, MasonryDiv } from './styles';

const fillCols = (children: JSX.Element[], cols: JSX.Element[][]) => {
    children.forEach((child, i) => cols[i % cols.length].push(child));
};

interface IMasonry {
    children: JSX.Element[];
    gap?: string;
    minWidth?: number;
}

const Masonry: React.FC<IMasonry> = ({
    children,
    gap,
    minWidth = 500,
    ...rest
}) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [numCols, setNumCols] = useState(4);
    const cols = [...Array(numCols)].map(() => []);
    fillCols(children, cols);
    const resizeHandler = () => {
        if (ref?.current?.offsetWidth) {
            setNumCols(Math.ceil(ref.current.offsetWidth / minWidth));
        }
    };
    useEffect(() => {
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    });
    useEffect(resizeHandler, []);
    // useEventListener(`resize`, resizeHandler);
    return (
        <MasonryDiv ref={ref} gap={gap} {...rest}>
            {[...Array(numCols)].map((_, index) => (
                <Col key={index} gap={gap}>
                    {cols[index]}
                </Col>
            ))}
        </MasonryDiv>
    );
};

export default Masonry;
