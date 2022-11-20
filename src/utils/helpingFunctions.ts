export function getRandShippingFee() {
    const from = 10_000;
    const to = 30_000;
    return Math.floor(Math.random() * (from - to) + to);
}
