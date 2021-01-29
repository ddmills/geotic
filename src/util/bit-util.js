const ONE = 1n;

export const subtractBit = (num, bit) => {
    return num & ~(1n << bit);
};

export const addBit = (num, bit) => {
    return num | ONE << bit;
};

export const hasBit = (num, bit) => {
    return ((num >> bit) % 2n !== 0n);
};

export const bitIntersection = (n1, n2) => {
    return n1 & n2
}
